import { Request, Response } from 'express';
import { Paper } from '../models/Paper';
import { StudentAttempt } from '../models/StudentAttempt';
import mongoose from 'mongoose';

// Create Paper (Teachers only)
export const createPaper = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can create papers.' });
    }

    const { title, description, questions, deadline, timeLimit } = req.body;

    if (!title || !questions || !deadline || !timeLimit) {
      return res.status(400).json({ message: 'Title, questions, deadline, and time limit are required' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
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

    const paper = new Paper({
      title,
      description,
      teacherId: requestingUser._id,
      questions: questions.map((q: any, index: number) => ({
        ...q,
        order: index + 1
      })),
      deadline: new Date(deadline),
      timeLimit
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
        timeLimit: paper.timeLimit
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
      // Teachers see all their papers
      papers = await Paper.find({ teacherId: requestingUser._id })
        .select('-questions.options.isCorrect') // Hide correct answers
        .sort({ createdAt: -1 });
    } else {
      // Students see available papers (not expired and not attempted)
      const currentDate = new Date();
      
      // Get paper IDs that student has already attempted
      const attemptedPapers = await StudentAttempt.find({ 
        studentId: requestingUser._id 
      }).distinct('paperId');

      papers = await Paper.find({
        deadline: { $gte: currentDate },
        _id: { $nin: attemptedPapers }
      }).select('-questions.options.isCorrect -teacherId')
        .sort({ deadline: 1 });
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
    const requestingUser = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid paper ID' });
    }

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Check if student has already attempted
    if (requestingUser.role === 'student') {
      const existingAttempt = await StudentAttempt.findOne({
        paperId: id,
        studentId: requestingUser._id
      });

      if (existingAttempt) {
        return res.status(400).json({ message: 'You have already attempted this paper' });
      }

      // Check if paper is still available
      if (new Date() > paper.deadline) {
        return res.status(400).json({ message: 'This paper is no longer available' });
      }

      // Return paper without correct answers for students
      const studentPaper = {
        _id: paper._id,
        title: paper.title,
        description: paper.description,
        deadline: paper.deadline,
        timeLimit: paper.timeLimit,
        totalQuestions: paper.totalQuestions,
        questions: paper.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          order: q.order,
          options: q.options.map(opt => ({
            _id: opt._id,
            optionText: opt.optionText
          }))
        }))
      };

      return res.json({ paper: studentPaper });
    }

    // Teachers get full paper with correct answers
    res.json({ paper });

  } catch (error) {
    console.error('Get paper by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit paper attempt (Students only)
export const submitPaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;
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

    // Check if paper is still available
    if (new Date() > paper.deadline) {
      return res.status(400).json({ message: 'Paper deadline has passed' });
    }

    // Check if student has already attempted
    const existingAttempt = await StudentAttempt.findOne({
      paperId: id,
      studentId: requestingUser._id
    });

    if (existingAttempt) {
      return res.status(400).json({ message: 'You have already submitted this paper' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers are required' });
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

    // Create attempt record
    const attempt = new StudentAttempt({
      paperId: id,
      studentId: requestingUser._id,
      answers: processedAnswers,
      score,
      totalQuestions: paper.totalQuestions,
      percentage,
      status: 'submitted',
      submittedAt: new Date(),
      timeSpent: timeSpent || 0
    });

    await attempt.save();

    res.json({
      message: 'Paper submitted successfully',
      result: {
        score,
        totalQuestions: paper.totalQuestions,
        percentage,
        timeSpent
      }
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

    const results = await StudentAttempt.find({ 
      studentId: requestingUser._id,
      status: 'submitted'
    })
    .populate('paperId', 'title description deadline')
    .sort({ submittedAt: -1 });

    res.json({ results });

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
    if (paper.teacherId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ message: 'You can only view results for your own papers' });
    }

    const results = await StudentAttempt.find({ 
      paperId: id,
      status: 'submitted'
    })
    .populate('studentId', 'username firstName lastName')
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
    if (paper.teacherId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own papers' });
    }

    // Check if any student has already attempted this paper
    const hasAttempts = await StudentAttempt.findOne({ paperId: id });
    if (hasAttempts) {
      return res.status(400).json({ 
        message: 'Cannot update paper after students have attempted it' 
      });
    }

    const { title, description, questions, deadline, timeLimit } = req.body;

    // Validate questions if provided
    if (questions) {
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
    }

    // Update paper
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (deadline) updateData.deadline = new Date(deadline);
    if (timeLimit) updateData.timeLimit = timeLimit;
    if (questions) {
      updateData.questions = questions.map((q: any, index: number) => ({
        ...q,
        order: index + 1
      }));
    }

    const updatedPaper = await Paper.findByIdAndUpdate(id, updateData, { 
      new: true 
    });

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
    if (paper.teacherId.toString() !== requestingUser._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own papers' });
    }

    // Check if any student has already attempted this paper
    const hasAttempts = await StudentAttempt.findOne({ paperId: id });
    if (hasAttempts) {
      return res.status(400).json({ 
        message: 'Cannot delete paper after students have attempted it. Consider archiving instead.' 
      });
    }

    await Paper.findByIdAndDelete(id);

    res.json({ 
      message: 'Paper deleted successfully' 
    });

  } catch (error) {
    console.error('Delete paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

