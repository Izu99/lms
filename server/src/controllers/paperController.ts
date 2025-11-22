import { Request, Response } from 'express';
import { Paper } from '../models/Paper';
import { StudentAttempt } from '../models/StudentAttempt';
import mongoose from 'mongoose';
import path from 'path'; // Import path module
import { IPaper, IQuestion } from '../models/Paper';
import { deleteFile } from '../utils/fileUploadUtils'; // Import the deleteFile utility

const UPLOADS_DIR = path.join(__dirname, '../../uploads'); // Define uploads directory

/**
 * Extracts all image URLs from a given paper object.
 * @param paper The paper object (IPaper) from which to extract image URLs.
 * @returns An array of unique image URLs (strings).
 */
const extractImageUrlsFromPaper = (paper: IPaper): string[] => {
  const imageUrls: string[] = [];

  // Add paper-level fileUrl if it exists (for Structure papers)
  if (paper.fileUrl) {
    imageUrls.push(paper.fileUrl);
  }

  // Extract image URLs from questions, options, and explanations
  if (paper.questions && paper.questions.length > 0) {
    paper.questions.forEach((question: IQuestion) => {
      if (question.imageUrl) {
        imageUrls.push(question.imageUrl);
      }
      if (question.explanation?.imageUrl) {
        imageUrls.push(question.explanation.imageUrl);
      }
      if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
          if (option.imageUrl) {
            imageUrls.push(option.imageUrl);
          }
        });
      }
    });
  }
  // Return unique URLs to avoid attempting to delete the same file multiple times
  return [...new Set(imageUrls)];
};

// Create Paper (Teachers only)
export const createPaper = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can create papers.' });
    }

    const { title, description, questions, deadline, timeLimit, availability, price, paperType, fileUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (paperType === 'MCQ') {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'At least one question is required for an MCQ paper' });
      }

      // Validate questions structure
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question.questionText || !question.options || question.options.length < 2) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have question text and at least 2 options` 
          });
        }

        const correctAnswers = question.options.filter((opt: any) => opt.isCorrect);
        if (correctAnswers.length !== 1) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have exactly one correct answer` 
          });
        }
      }
    } else if (paperType === 'Structure') {
      if (!fileUrl) {
        return res.status(400).json({ message: 'A PDF file is required for a structure paper' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid paper type' });
    }

    const paper = new Paper({
      title,
      description,
      teacherId: requestingUser.id,
      questions: paperType === 'MCQ' ? questions.map((q: any, index: number) => ({
        ...q,
        order: index + 1
      })) : [],
      ...(deadline && { deadline: new Date(deadline) }),
      ...(timeLimit && { timeLimit: timeLimit }),
      availability,
      ...(price && { price: price }),
      paperType,
      ...(fileUrl && { fileUrl }),
    });

    await paper.save();

    res.status(201).json({ 
      message: 'Paper created successfully', 
      paper: {
        _id: paper._id,
        title: paper.title,
        description: paper.description,
        totalQuestions: paper.totalQuestions,
        deadline: paper.deadline,
        timeLimit: paper.timeLimit,
        paperType: paper.paperType,
      }
    });

  } catch (error) {
    console.error('Create paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all papers (Students see available papers, Teachers see their papers)
export const getAllPapers = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    let papers;

    if (requestingUser.role === 'teacher' || requestingUser.role === 'admin') {
      // Teachers and Admins see all papers with attempt counts
      papers = await Paper.find()
        .select('-questions.options.isCorrect') // Hide correct answers
        .sort({ createdAt: -1 });
      
      // Add attempt count for each paper
      const papersWithAttemptCount = await Promise.all(
        papers.map(async (paper) => {
          const submissionCount = await StudentAttempt.countDocuments({ 
            paperId: paper._id,
            status: 'submitted'
          });
          return {
            ...paper.toObject(),
            submissionCount
          };
        })
      );
      papers = papersWithAttemptCount;
    } else {
      // Students see available papers (not expired and not attempted)
      const currentDate = new Date();
      
      // Get paper IDs that student has already attempted
      const attemptedPapers = await StudentAttempt.find({
        studentId: requestingUser.id
      }).distinct('paperId');
      
      papers = await Paper.find({
        deadline: { $gte: currentDate },
        _id: { $nin: attemptedPapers }
      }).select('-questions.options.isCorrect -teacherId')
        .sort({ createdAt: -1 });
    }
    
    res.json({ papers, total: papers.length });

  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get paper by ID (Students get questions without correct answers)
export const getPaperById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { showAnswers } = req.query; // New query parameter for answers view
    const requestingUser = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // If user is not a student, or is a teacher/admin, grant full access
    if (!requestingUser || requestingUser.role !== 'student') {
      // Teachers get full paper with correct answers
      return res.json({ paper });
    }

    // Access control logic for students
    const studentType = requestingUser.studentType;

    let hasAccess = false;
    // let paymentRequired = false; // Commented out for bypass

    if (paper.availability === 'all') {
      hasAccess = true;
    } else if (paper.availability === 'physical' && studentType === 'Physical') {
      hasAccess = true;
    } else {
      // Temporarily bypass payment requirement
      hasAccess = true;
    }

    // if (paymentRequired) { // Commented out for bypass
    //   return res.status(402).json({
    //     message: 'Payment required to access this paper.',
    //     price: paper.price,
    //     paperTitle: paper.title,
    //     paperId: paper._id
    //   });
    // }


    if (!hasAccess) {
      // This case should ideally not be reached if logic is exhaustive, but as a fallback
      return res.status(403).json({ message: 'Access denied to this paper.' });
    }

    // If student has access, proceed with existing student logic
    const isPaperExpired = paper.deadline ? (new Date() > paper.deadline) : false;
    const hasAttempted = await StudentAttempt.exists({ paperId: id, studentId: requestingUser.id });
    


    // Construct studentPaper
    const studentPaper = {
      _id: paper._id,
      title: paper.title,
      description: paper.description,
      deadline: paper.deadline,
      timeLimit: paper.timeLimit,
      totalQuestions: paper.totalQuestions,
      paperType: paper.paperType, // Ensure paperType is included
      fileUrl: paper.fileUrl, // Include fileUrl for structure papers
      questions: paper.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        order: q.order,
        imageUrl: q.imageUrl,
        options: q.options.map(opt => ({
          _id: opt._id,
          optionText: opt.optionText,
          imageUrl: opt.imageUrl, // Always include imageUrl for options
          // Include isCorrect if:
          // 1. Viewing answers page AND student has attempted, OR
          // 2. Paper is expired AND student has attempted
          ...((showAnswers && hasAttempted) || (isPaperExpired && hasAttempted) ? { isCorrect: opt.isCorrect } : {})
        })),
        // Include explanation (විවරණ) if:
        // 1. Viewing answers page AND student has attempted, OR  
        // 2. Paper is expired AND student has attempted
        ...((showAnswers && hasAttempted) || (isPaperExpired && hasAttempted)) && q.explanation && (q.explanation.text || q.explanation.imageUrl) ? { 
          explanation: q.explanation 
        } : {}
      }))
    };

    // Always return the paper, client will handle if it's attempted or expired
    return res.json({ paper: studentPaper });

  } catch (error) {
    console.error('Get paper by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit paper attempt (Students only)
export const submitPaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent, answerFileUrl } = req.body;
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit papers' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Check if paper is still available (only if deadline is set)
    if (paper.deadline && new Date() > paper.deadline) {
      return res.status(400).json({ message: 'Paper deadline has passed' });
    }

    // Check if student has already attempted
    const existingAttempt = await StudentAttempt.findOne({
      paperId: id,
      studentId: requestingUser.id
    });

    if (existingAttempt) {
      return res.status(400).json({ message: 'You have already submitted this paper' });
    }

    let attemptData: any = {
      paperId: id,
      studentId: requestingUser.id,
      status: 'submitted',
      submittedAt: new Date(),
      timeSpent: timeSpent || 0
    };

    if (paper.paperType === 'MCQ') {
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Answers are required for MCQ papers' });
      }

      // Calculate score
      let score = 0;
      const processedAnswers = answers.map((answer: any) => {
        const question = paper.questions.find(q => q._id?.toString() === answer.questionId);
        if (!question) {
          throw new Error('Invalid question ID');
        }

        const selectedOption = question.options.find(opt => opt._id?.toString() === answer.selectedOptionId);
        if (!selectedOption) {
          throw new Error('Invalid option ID');
        }

        const isCorrect = selectedOption.isCorrect;
        if (isCorrect) score++;

        return {
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect
        };
      });

      const percentage = Math.round((score / paper.totalQuestions) * 100);

      attemptData = {
        ...attemptData,
        answers: processedAnswers,
        score,
        totalQuestions: paper.totalQuestions,
        percentage,
      };
    } else if (paper.paperType === 'Structure') {
      if (!answerFileUrl) {
        return res.status(400).json({ message: 'An answer file is required for structure papers' });
      }
      attemptData = {
        ...attemptData,
        answerFileUrl,
        totalQuestions: 0, // No questions for structure papers
      };
    }

    // Create attempt record
    const attempt = new StudentAttempt(attemptData);
    await attempt.save();

    res.json({
      message: 'Paper submitted successfully',
      attempt
    });

  } catch (error) {
    console.error('Submit paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student results
export const getStudentResults = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch all student attempts, populating paper details
    const results = await StudentAttempt.find({
      studentId: requestingUser.id,
      status: 'submitted'
    })
    .populate('paperId', 'title description deadline paperType') // Populate paperType as well
    .sort({ submittedAt: -1 })
    .lean(); // Use .lean() for performance when modifying results

    // Extract unique paper IDs from the results
    const uniquePaperIds = [...new Set(results.filter(r => r.paperId).map(r => r.paperId._id.toString()))];

    // Calculate average percentage for each unique paper
    const paperAverages: { [key: string]: number } = {};
    for (const paperId of uniquePaperIds) {
      const averageResult = await StudentAttempt.aggregate([
        { $match: { paperId: new mongoose.Types.ObjectId(paperId), status: 'submitted' } },
        { $group: { _id: null, averagePercentage: { $avg: '$percentage' } } }
      ]);
      paperAverages[paperId] = averageResult[0]?.averagePercentage ? Math.round(averageResult[0].averagePercentage) : 0;
    }

    // Map over results to add averagePercentage to each paperId object
    const enrichedResults = results
      .filter(result => result.paperId !== null) // Add this filter
      .map(result => ({
      ...result,
      paperId: {
        ...result.paperId,
        averagePercentage: paperAverages[result.paperId._id.toString()] || 0
      }
    }));

    res.json({ results: enrichedResults });

  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get paper results (Teachers only)
export const getPaperResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can view results.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Check if teacher owns this paper
    if (paper.teacherId.toString() !== requestingUser.id.toString()) {
      return res.status(403).json({ 
        message: 'You can only view results for your own papers'
      });
    }

    const results = await StudentAttempt.find({ 
      paperId: id,
      status: 'submitted'
    })
    .populate('studentId', 'username firstName lastName')
    .populate('paperId', 'paperType totalQuestions') // Populate paperType and totalQuestions
    .sort({ percentage: -1, submittedAt: 1 });

    const stats = {
      totalSubmissions: results.length,
      averageScore: results.length ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0,
      highestScore: results.length ? Math.max(...results.map(r => r.percentage)) : 0,
      lowestScore: results.length ? Math.min(...results.map(r => r.percentage)) : 0
    };

    res.json({ 
      paper: {
        title: paper.title,
        totalQuestions: paper.totalQuestions,
        deadline: paper.deadline
      },
      results,
      stats
    });

  } catch (error) {
    console.error('Get paper results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Paper (Teachers only)
export const updatePaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;
    
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can update papers.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Check if teacher owns this paper
    if (paper.teacherId.toString() !== requestingUser.id.toString()) {
      return res.status(403).json({ message: 'You can only update your own papers' });
    }



    // 1. Find the existing paper before the update
    const oldPaper = await Paper.findById(id);
    if (!oldPaper) {
      return res.status(404).json({ message: 'Paper not found' }); // Should not happen if previous check passed, but for type safety
    }
    const oldImageUrls = extractImageUrlsFromPaper(oldPaper);

    const { title, description, questions, deadline, timeLimit, availability, price, paperType, fileUrl } = req.body;

    // Validate questions if provided (keep existing validation)
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        // Ensure that questionText or an imageUrl is provided for options
        if (!question.questionText && !question.imageUrl && question.options) {
            // Check if options have either text or image
            const optionsAreValid = question.options.every((opt: any) => opt.optionText || opt.imageUrl);
            if (!optionsAreValid) {
                return res.status(400).json({
                    message: `Question ${i + 1} must have question text or image, and all options must have text or image.`
                });
            }
        }
        if (!question.options || question.options.length < 2) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have at least 2 options` 
          });
        }
        const correctAnswers = question.options.filter((opt: any) => opt.isCorrect);
        if (correctAnswers.length !== 1) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have exactly one correct answer` 
          });
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      timeLimit,
      availability,
      price,
    };

    if (paperType === 'MCQ') {
      updateData.questions = questions.map((q: any, index: number) => ({
        ...q,
        order: index + 1
      }));
      updateData.fileUrl = undefined; // Ensure fileUrl is cleared for MCQ papers
    } else if (paperType === 'Structure') {
      updateData.fileUrl = fileUrl;
      updateData.questions = []; // Ensure questions are cleared for Structure papers
    }

    // 2. Perform the update
    const updatedPaper = await Paper.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true // Ensure Mongoose validators run on update
    });

    if (!updatedPaper) {
      return res.status(404).json({ message: 'Paper not found after update attempt' });
    }

    // 3. Extract new image URLs from the updated paper
    const newImageUrls = extractImageUrlsFromPaper(updatedPaper);

    // 4. Compare and Delete: Delete images that are no longer referenced
    const imagesToKeep = new Set(newImageUrls);
    for (const oldImageUrl of oldImageUrls) {
      // Check if the old image URL is a paper-level fileUrl for structure papers
      // If the paperType changed from Structure to MCQ, and oldImageURL was the fileUrl, delete it.
      if (oldPaper.paperType === 'Structure' && oldPaper.fileUrl === oldImageUrl && updatedPaper.paperType === 'MCQ') {
        await deleteFile(oldImageUrl);
        continue;
      }
      // Delete if the old image URL is not in the new set of image URLs
      if (!imagesToKeep.has(oldImageUrl)) {
        await deleteFile(oldImageUrl);
      }
    }

    res.json({ 
      message: 'Paper updated successfully', 
      paper: updatedPaper 
    });

  } catch (error) {
    console.error('Update paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Paper (Teachers only)
export const deletePaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;
    
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can delete papers.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Check if teacher owns this paper
    if (paper.teacherId.toString() !== requestingUser.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own papers' });
    }



    // Extract all image URLs associated with the paper
    const imageUrlsToDelete = extractImageUrlsFromPaper(paper);

    // Delete the paper document
    await Paper.findByIdAndDelete(id);

    // Delete associated image files from the file system
    for (const imageUrl of imageUrlsToDelete) {
      await deleteFile(imageUrl);
    }

    res.json({ 
      message: 'Paper deleted successfully' 
    });

  } catch (error) {

    console.error('Delete paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all papers for a student
export const getAllPapersForStudent = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'student') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const papers = await Paper.find()
      .select('-questions.options.isCorrect -teacherId')
      .sort({ createdAt: -1 });

    const attemptedPapers = await StudentAttempt.find({
      studentId: requestingUser.id
    }).distinct('paperId');

    res.json({ papers, attemptedPapers, total: papers.length });

  } catch (error) {
    console.error('Get all papers for student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single student attempt for a paper
export const getStudentAttemptForPaper = async (req: Request, res: Response) => {
  try {
    const { paperId } = req.params;
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Only students can view their attempts.' });
    }

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const studentAttempt = await StudentAttempt.findOne({
      paperId: paperId,
      studentId: requestingUser.id,
      status: 'submitted'
    }).populate('paperId', 'title description deadline timeLimit totalQuestions'); // Populate paper details

    if (!studentAttempt) {
      return res.status(404).json({ message: 'Student attempt not found for this paper.' });
    }

    res.json({ studentAttempt });

  } catch (error) {
    console.error('Get student attempt for paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadPaperPdf = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: `/uploads/${req.file.filename}`
    });
};

export const downloadStudentAttemptFile = async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers and admins can download student attempt files.' });
    }

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }

    const attempt = await StudentAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Student attempt not found.' });
    }

    if (!attempt.answerFileUrl) {
      return res.status(404).json({ message: 'No answer file found for this attempt.' });
    }

    // Ensure the answerFileUrl is correctly formatted (e.g., /uploads/filename.pdf)
    const relativeFilePath = attempt.answerFileUrl.startsWith('/uploads/') 
                           ? attempt.answerFileUrl.substring('/uploads/'.length) 
                           : attempt.answerFileUrl;
                           
    const filePath = path.join(UPLOADS_DIR, relativeFilePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          return res.status(500).json({ message: 'Error downloading file.' });
        }
      }
    });

  } catch (error) {
    console.error('Download student attempt file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentAttemptMarks = async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { score } = req.body;
    const requestingUser = (req as any).user;

    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers and admins can update student attempt marks.' });
    }

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ message: 'Invalid attempt ID' });
    }
    
    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ message: 'Score must be a non-negative number.' });
    }

    const attempt = await StudentAttempt.findById(attemptId).populate('paperId');

    if (!attempt) {
      return res.status(404).json({ message: 'Student attempt not found.' });
    }

    const paper = attempt.paperId as any; // Populate 'paperId' to get totalQuestions
    if (!paper) {
      return res.status(404).json({ message: 'Associated paper not found.' });
    }

    // Update score and calculate percentage
    attempt.score = score;
    // For structure papers, totalQuestions might be 0, so calculate percentage based on score if possible, or set to 0.
    if (paper.totalQuestions && paper.totalQuestions > 0) {
        attempt.percentage = Math.round((score / paper.totalQuestions) * 100);
    } else {
        // For structure papers, the 'score' received from the frontend is directly the percentage.
        attempt.percentage = score;
    }
    
    await attempt.save();

    res.json({ 
        message: 'Student attempt marks updated successfully', 
        attempt: {
            _id: attempt._id,
            score: attempt.score,
            percentage: attempt.percentage
        }
    });

  } catch (error) {
    console.error('Update student attempt marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

