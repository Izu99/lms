"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentAttemptMarks = exports.downloadStudentAttemptFile = exports.uploadTeacherReviewFile = exports.getAttemptById = exports.uploadPaperPdf = exports.getStudentAttemptForPaper = exports.getAllPapersForStudent = exports.deletePaper = exports.updatePaper = exports.getPaperResults = exports.getStudentResults = exports.submitPaper = exports.getPaperById = exports.getAllPapers = exports.createPaper = void 0;
const Paper_1 = require("../models/Paper");
const StudentAttempt_1 = require("../models/StudentAttempt");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path")); // Import path module
const fileUploadUtils_1 = require("../utils/fileUploadUtils"); // Import the deleteFile utility
const UPLOADS_DIR = path_1.default.join(__dirname, '../../uploads'); // Define uploads directory
/**
 * Extracts all image URLs from a given paper object.
 * @param paper The paper object (IPaper) from which to extract image URLs.
 * @returns An array of unique image URLs (strings).
 */
const extractImageUrlsFromPaper = (paper) => {
    const imageUrls = [];
    // Add paper-level fileUrl if it exists (for Structure papers)
    if (paper.fileUrl) {
        imageUrls.push(paper.fileUrl);
    }
    // Add paper-level thumbnailUrl if it exists
    if (paper.thumbnailUrl) {
        imageUrls.push(paper.thumbnailUrl);
    }
    // Extract image URLs from questions, options, and explanations
    if (paper.questions && paper.questions.length > 0) {
        paper.questions.forEach((question) => {
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
const createPaper = async (req, res) => {
    try {
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers and paper managers can create papers.' });
        }
        const files = req.files;
        const mainFile = files?.file ? files.file[0] : undefined;
        const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : undefined;
        const { title, description, deadline, timeLimit, availability, price, paperType, institute, year, academicLevel } = req.body;
        let { questions } = req.body;
        if (typeof questions === 'string') {
            questions = JSON.parse(questions);
        }
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (mainFile) {
            console.log('Main File Path:', mainFile.path);
            console.log('Split Result:', mainFile.path.split('uploads/'));
        }
        const fileUrl = mainFile ? mainFile.path.replace(/\\/g, '/').split('uploads/').pop() : undefined;
        console.log('Generated fileUrl:', fileUrl);
        const thumbnailUrl = thumbnailFile ? thumbnailFile.path.replace(/\\/g, '/').split('uploads/').pop() : undefined;
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
                const correctAnswers = question.options.filter((opt) => opt.isCorrect);
                if (correctAnswers.length !== 1) {
                    return res.status(400).json({
                        message: `Question ${i + 1} must have exactly one correct answer`
                    });
                }
            }
        }
        else if (paperType === 'Structure-Essay') {
            if (!fileUrl) { // Check for main file upload
                return res.status(400).json({ message: 'A PDF file is required for a Structure and Essay paper' });
            }
        }
        else {
            return res.status(400).json({ message: 'Invalid paper type' });
        }
        const paper = new Paper_1.Paper({
            title,
            description,
            teacherId: requestingUser.id,
            institute,
            year,
            academicLevel, // Add academicLevel
            questions: paperType === 'MCQ' ? questions.map((q, index) => ({
                ...q,
                order: index + 1
            })) : [],
            ...(deadline && { deadline: new Date(deadline) }),
            ...(timeLimit && { timeLimit: timeLimit }),
            availability,
            ...(price && { price: price }),
            paperType,
            fileUrl, // Include fileUrl
            thumbnailUrl, // Include thumbnailUrl
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
    }
    catch (error) {
        console.error('Create paper error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createPaper = createPaper;
// Get all papers (Students see available papers, Teachers see their papers)
// Get all papers (Students see available papers, Teachers see their papers)
const getAllPapers = async (req, res) => {
    try {
        const requestingUser = req.user;
        const { institute, year, academicLevel } = req.query;
        let papers;
        if (requestingUser.role === 'teacher' || requestingUser.role === 'admin' || requestingUser.role === 'paper_manager') {
            const filter = {};
            if (institute && institute !== 'all')
                filter.institute = institute;
            if (year && year !== 'all')
                filter.year = year;
            if (academicLevel && academicLevel !== 'all')
                filter.academicLevel = academicLevel;
            // Teachers and Admins see all papers with attempt counts
            papers = await Paper_1.Paper.find(filter)
                .select('-questions.options.isCorrect') // Hide correct answers
                .populate('institute', 'name location')
                .populate('year', 'year name')
                .sort({ createdAt: -1 });
            // Add attempt count for each paper
            const papersWithAttemptCount = await Promise.all(papers.map(async (paper) => {
                const submissionCount = await StudentAttempt_1.StudentAttempt.countDocuments({
                    paperId: paper._id,
                    status: 'submitted'
                });
                return {
                    ...paper.toObject(),
                    submissionCount
                };
            }));
            papers = papersWithAttemptCount;
        }
        else {
            // Students see available papers (not expired and not attempted)
            // Note: Students usually don't use these filters on the main list, but we can support them if needed.
            // For now, keeping student logic as is regarding filters, or applying them if passed.
            const filter = {};
            if (institute && institute !== 'all')
                filter.institute = institute;
            if (year && year !== 'all')
                filter.year = year;
            if (academicLevel && academicLevel !== 'all')
                filter.academicLevel = academicLevel;
            const currentDate = new Date();
            // Get paper IDs that student has already attempted
            const attemptedPapers = await StudentAttempt_1.StudentAttempt.find({
                studentId: requestingUser.id
            }).distinct('paperId');
            papers = await Paper_1.Paper.find({
                ...filter,
                deadline: { $gte: currentDate },
                _id: { $nin: attemptedPapers }
            }).select('-questions.options.isCorrect -teacherId')
                .sort({ createdAt: -1 });
        }
        res.json({ papers, total: papers.length });
    }
    catch (error) {
        console.error('Get papers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllPapers = getAllPapers;
// Get paper by ID (Students get questions without correct answers)
const getPaperById = async (req, res) => {
    try {
        const { id } = req.params;
        const { showAnswers } = req.query; // New query parameter for answers view
        const requestingUser = req.user;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const paper = await Paper_1.Paper.findById(id);
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
        }
        else if (paper.availability === 'physical' && studentType === 'Physical') {
            hasAccess = true;
        }
        else if (paper.availability === 'paid') {
            // paymentRequired = true; // Uncomment when payment is implemented
            hasAccess = false; // Deny access for now if paid only
        }
        else {
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
        const hasAttempted = await StudentAttempt_1.StudentAttempt.exists({ paperId: id, studentId: requestingUser.id });
        // New, clearer condition for when a student should be able to see the answers
        const canViewAnswers = hasAttempted && ((paper.deadline && new Date() > paper.deadline) || // Paper is expired
            !paper.deadline // OR paper has no deadline
        );
        // Determine if the answers should be revealed in the response
        const shouldRevealAnswers = (showAnswers === 'true' && hasAttempted) || canViewAnswers;
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
                    ...(shouldRevealAnswers && { isCorrect: opt.isCorrect })
                })),
                // Include explanation if answers are being revealed
                ...(shouldRevealAnswers && q.explanation && (q.explanation.text || q.explanation.imageUrl) ? {
                    explanation: q.explanation
                } : {})
            }))
        };
        // Always return the paper, client will handle if it's attempted or expired
        return res.json({ paper: studentPaper });
    }
    catch (error) {
        console.error('Get paper by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getPaperById = getPaperById;
// Submit paper attempt (Students only)
const submitPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers, timeSpent, answerFileUrl } = req.body;
        const requestingUser = req.user;
        if (requestingUser.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit papers' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const paper = await Paper_1.Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        // Check if paper is still available (only if deadline is set)
        if (paper.deadline && new Date() > paper.deadline) {
            return res.status(400).json({ message: 'Paper deadline has passed' });
        }
        // Check if student has already attempted
        const existingAttempt = await StudentAttempt_1.StudentAttempt.findOne({
            paperId: id,
            studentId: requestingUser.id
        });
        if (existingAttempt) {
            return res.status(400).json({ message: 'You have already submitted this paper' });
        }
        let attemptData = {
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
            const processedAnswers = answers.map((answer) => {
                const question = paper.questions.find(q => q._id?.toString() === answer.questionId);
                if (!question) {
                    throw new Error('Invalid question ID');
                }
                const selectedOption = question.options.find(opt => opt._id?.toString() === answer.selectedOptionId);
                if (!selectedOption) {
                    throw new Error('Invalid option ID');
                }
                const isCorrect = selectedOption.isCorrect;
                if (isCorrect)
                    score++;
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
        }
        else if (paper.paperType === 'Structure-Essay') {
            if (!answerFileUrl) {
                return res.status(400).json({ message: 'An answer file is required for Structure and Essay papers' });
            }
            attemptData = {
                ...attemptData,
                answerFileUrl,
                totalQuestions: 0, // No questions for Structure and Essay papers
            };
        }
        // Create attempt record
        const attempt = new StudentAttempt_1.StudentAttempt(attemptData);
        await attempt.save();
        res.json({
            message: 'Paper submitted successfully',
            attempt
        });
    }
    catch (error) {
        console.error('Submit paper error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.submitPaper = submitPaper;
// Get student results
const getStudentResults = async (req, res) => {
    try {
        const requestingUser = req.user;
        if (requestingUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Fetch all student attempts, populating paper details
        const results = await StudentAttempt_1.StudentAttempt.find({
            studentId: requestingUser.id,
            status: 'submitted'
        })
            .populate('paperId', 'title description deadline paperType') // Populate paperType as well
            .sort({ submittedAt: -1 })
            .lean(); // Use .lean() for performance when modifying results
        // Extract unique paper IDs from the results
        const uniquePaperIds = [...new Set(results.filter(r => r.paperId).map(r => r.paperId._id.toString()))];
        // Calculate average percentage for each unique paper
        const paperAverages = {};
        for (const paperId of uniquePaperIds) {
            const averageResult = await StudentAttempt_1.StudentAttempt.aggregate([
                { $match: { paperId: new mongoose_1.default.Types.ObjectId(paperId), status: 'submitted' } },
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
    }
    catch (error) {
        console.error('Get student results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudentResults = getStudentResults;
// Get paper results (Teachers only)
const getPaperResults = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers and paper managers can view results.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const paper = await Paper_1.Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        // Teachers, paper managers, and admins can all view results for any paper
        const results = await StudentAttempt_1.StudentAttempt.find({
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
    }
    catch (error) {
        console.error('Get paper results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getPaperResults = getPaperResults;
// Update Paper (Teachers only)
const updatePaper = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers and paper managers can update papers.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const paper = await Paper_1.Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        // Teachers, paper managers, and admins can all update any paper
        // Check if there are any student attempts for this paper
        const attemptCount = await StudentAttempt_1.StudentAttempt.countDocuments({ paperId: id });
        if (attemptCount > 0) {
            return res.status(403).json({
                message: `This paper cannot be edited because it already has ${attemptCount} student submission(s).`
            });
        }
        // 1. Find the existing paper before the update
        const oldPaper = await Paper_1.Paper.findById(id);
        if (!oldPaper) {
            return res.status(404).json({ message: 'Paper not found' }); // Should not happen if previous check passed, but for type safety
        }
        const oldImageUrls = extractImageUrlsFromPaper(oldPaper);
        const files = req.files;
        const mainFile = files?.file ? files.file[0] : undefined;
        const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : undefined;
        const { title, description, deadline, timeLimit, availability, price, paperType, institute, year, academicLevel } = req.body;
        let { questions } = req.body;
        if (typeof questions === 'string') {
            questions = JSON.parse(questions);
        }
        // Validate questions if provided (keep existing validation)
        if (questions) {
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                // Ensure that questionText or an imageUrl is provided for options
                if (!question.questionText && !question.imageUrl && question.options) {
                    // Check if options have either text or image
                    const optionsAreValid = question.options.every((opt) => opt.optionText || opt.imageUrl);
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
                const correctAnswers = question.options.filter((opt) => opt.isCorrect);
                if (correctAnswers.length !== 1) {
                    return res.status(400).json({
                        message: `Question ${i + 1} must have exactly one correct answer`
                    });
                }
            }
        }
        // Determine new fileUrl and thumbnailUrl
        if (mainFile) {
            console.log('Update Main File Path:', mainFile.path);
        }
        const newFileUrl = mainFile ? mainFile.path.replace(/\\/g, '/').split('uploads/').pop() : undefined;
        console.log('Update Generated newFileUrl:', newFileUrl);
        const newThumbnailUrl = thumbnailFile ? thumbnailFile.path.replace(/\\/g, '/').split('uploads/').pop() : undefined;
        // Prepare update data
        const updateData = {
            title,
            description,
            deadline: deadline ? new Date(deadline) : undefined,
            timeLimit,
            availability,
            price,
            institute,
            year,
            academicLevel, // Add academicLevel
            // Only update fileUrl/thumbnailUrl if a new file was uploaded or it's explicitly set to null
            ...(newFileUrl !== undefined && { fileUrl: newFileUrl }),
            ...(newThumbnailUrl !== undefined && { thumbnailUrl: newThumbnailUrl }),
        };
        if (paperType === 'MCQ') {
            updateData.questions = questions.map((q, index) => ({
                ...q,
                order: index + 1
            }));
            // If paperType is MCQ, ensure fileUrl is cleared (as it's only for Structure-Essay)
            // Only clear if no new file was uploaded, otherwise newFileUrl takes precedence
            if (newFileUrl === undefined && oldPaper.fileUrl) {
                updateData.fileUrl = null;
            }
        }
        else if (paperType === 'Structure-Essay') {
            // For Structure-Essay, fileUrl is required. If no new file, retain old.
            if (newFileUrl === undefined && oldPaper.fileUrl) {
                updateData.fileUrl = oldPaper.fileUrl;
            }
            else if (newFileUrl === undefined && !oldPaper.fileUrl) {
                return res.status(400).json({ message: 'A PDF file is required for a Structure and Essay paper' });
            }
            updateData.questions = []; // Ensure questions are cleared for Structure papers
        }
        // 2. Perform the update
        const updatedPaper = await Paper_1.Paper.findByIdAndUpdate(id, updateData, {
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
            // Only delete if the old URL is not in the new set of URLs
            // and it's not the newly uploaded main file or thumbnail image
            const isNewMainFile = newFileUrl && oldImageUrl === oldPaper.fileUrl && newFileUrl !== oldPaper.fileUrl;
            const isNewThumbnail = newThumbnailUrl && oldImageUrl === oldPaper.thumbnailUrl && newThumbnailUrl !== oldPaper.thumbnailUrl;
            if (!imagesToKeep.has(oldImageUrl) || isNewMainFile || isNewThumbnail) {
                await (0, fileUploadUtils_1.deleteFile)(oldImageUrl);
            }
        }
        res.json({
            message: 'Paper updated successfully',
            paper: updatedPaper
        });
    }
    catch (error) {
        console.error('Update paper error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updatePaper = updatePaper;
// Delete Paper (Teachers only)
const deletePaper = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers and paper managers can delete papers.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const paper = await Paper_1.Paper.findById(id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        // Teachers, paper managers, and admins can all delete any paper
        // Extract all image URLs associated with the paper
        const imageUrlsToDelete = extractImageUrlsFromPaper(paper);
        // Delete the paper document
        await Paper_1.Paper.findByIdAndDelete(id);
        // Delete associated image files from the file system
        for (const imageUrl of imageUrlsToDelete) {
            await (0, fileUploadUtils_1.deleteFile)(imageUrl);
        }
        res.json({
            message: 'Paper deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete paper error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deletePaper = deletePaper;
// Get all papers for a student
const getAllPapersForStudent = async (req, res) => {
    try {
        const requestingUser = req.user;
        if (requestingUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const papers = await Paper_1.Paper.find()
            .select('-questions.options.isCorrect -teacherId')
            .sort({ createdAt: -1 });
        const attemptedPapers = await StudentAttempt_1.StudentAttempt.find({
            studentId: requestingUser.id
        }).distinct('paperId');
        res.json({ papers, attemptedPapers, total: papers.length });
    }
    catch (error) {
        console.error('Get all papers for student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllPapersForStudent = getAllPapersForStudent;
// Get a single student attempt for a paper
const getStudentAttemptForPaper = async (req, res) => {
    try {
        const { paperId } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students can view their attempts.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(paperId)) {
            return res.status(400).json({ message: 'Invalid paper ID' });
        }
        const studentAttempt = await StudentAttempt_1.StudentAttempt.findOne({
            paperId: paperId,
            studentId: requestingUser.id,
            status: 'submitted'
        }).populate('paperId', 'title description deadline timeLimit totalQuestions'); // Populate paper details
        if (!studentAttempt) {
            return res.status(404).json({ message: 'Student attempt not found for this paper.' });
        }
        res.json({ studentAttempt });
    }
    catch (error) {
        console.error('Get student attempt for paper error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudentAttemptForPaper = getStudentAttemptForPaper;
const uploadPaperPdf = (req, res) => {
    console.log('📤 [UPLOAD PDF] Starting upload...');
    console.log('  - uploadType:', req.uploadType);
    if (!req.file) {
        console.log('❌ [UPLOAD PDF] No file in request');
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    console.log('  - File info:', {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
    // Extract relative path from uploads/
    const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/').pop();
    const fileUrl = `/uploads/${relativePath}`;
    console.log('  - Relative path:', relativePath);
    console.log('  - Generated fileUrl:', fileUrl);
    console.log('✅ [UPLOAD PDF] Success');
    res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: fileUrl
    });
};
exports.uploadPaperPdf = uploadPaperPdf;
// Get a single student attempt by its ID
const getAttemptById = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const requestingUser = req.user;
        if (!mongoose_1.default.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ message: 'Invalid attempt ID' });
        }
        const attempt = await StudentAttempt_1.StudentAttempt.findById(attemptId).populate('paperId', 'title description deadline paperType');
        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }
        // Security check: Allow access only to the student who owns the attempt or a teacher/admin
        if (requestingUser.role !== 'teacher' &&
            requestingUser.role !== 'admin' &&
            requestingUser.role !== 'paper_manager' &&
            attempt.studentId.toString() !== requestingUser.id.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only view your own attempts.' });
        }
        // Deadline check for students
        if (requestingUser.role === 'student') {
            const paper = attempt.paperId;
            if (paper.deadline) {
                const now = new Date();
                const deadline = new Date(paper.deadline);
                if (now < deadline) {
                    return res.status(403).json({
                        message: `Answers will be available after the deadline: ${deadline.toLocaleString()}`,
                        deadline: deadline // Send deadline in response for frontend handling
                    });
                }
            }
        }
        res.json({ attempt });
    }
    catch (error) {
        console.error('Get attempt by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAttemptById = getAttemptById;
// Uploads a teacher's reviewed PDF for a student attempt
const uploadTeacherReviewFile = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers, paper managers and admins can upload review files.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ message: 'Invalid attempt ID' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const attempt = await StudentAttempt_1.StudentAttempt.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: 'Student attempt not found.' });
        }
        // If a previous review file exists, delete it first
        if (attempt.teacherReviewFileUrl) {
            await (0, fileUploadUtils_1.deleteFile)(attempt.teacherReviewFileUrl);
        }
        // Extract relative path from uploads/
        const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/').pop();
        const reviewFileUrl = `/uploads/${relativePath}`;
        console.log('📤 [TEACHER REVIEW] Upload info:');
        console.log('  - uploadType:', req.uploadType);
        console.log('  - File path:', req.file.path);
        console.log('  - Relative path:', relativePath);
        console.log('  - Generated URL:', reviewFileUrl);
        attempt.teacherReviewFileUrl = reviewFileUrl;
        await attempt.save();
        res.status(200).json({
            message: 'Review file uploaded successfully',
            teacherReviewFileUrl: attempt.teacherReviewFileUrl
        });
    }
    catch (error) {
        console.error('Upload teacher review file error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.uploadTeacherReviewFile = uploadTeacherReviewFile;
const downloadStudentAttemptFile = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers, paper managers and admins can download student attempt files.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ message: 'Invalid attempt ID' });
        }
        const attempt = await StudentAttempt_1.StudentAttempt.findById(attemptId);
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
        const filePath = path_1.default.join(UPLOADS_DIR, relativeFilePath);
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Error downloading file.' });
                }
            }
        });
    }
    catch (error) {
        console.error('Download student attempt file error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadStudentAttemptFile = downloadStudentAttemptFile;
const updateStudentAttemptMarks = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { score } = req.body;
        const requestingUser = req.user;
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin' && requestingUser.role !== 'paper_manager') {
            return res.status(403).json({ message: 'Access denied. Only teachers, paper managers and admins can update student attempt marks.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ message: 'Invalid attempt ID' });
        }
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ message: 'Score must be a non-negative number.' });
        }
        const attempt = await StudentAttempt_1.StudentAttempt.findById(attemptId).populate('paperId');
        if (!attempt) {
            return res.status(404).json({ message: 'Student attempt not found.' });
        }
        const paper = attempt.paperId; // Populate 'paperId' to get totalQuestions
        if (!paper) {
            return res.status(404).json({ message: 'Associated paper not found.' });
        }
        // Update score and calculate percentage
        attempt.score = score;
        // For Structure and Essay papers, totalQuestions might be 0, so calculate percentage based on score if possible, or set to 0.
        if (paper.totalQuestions && paper.totalQuestions > 0) {
            attempt.percentage = Math.round((score / paper.totalQuestions) * 100);
        }
        else {
            // For Structure and Essay papers, the 'score' received from the frontend is directly the percentage.
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
    }
    catch (error) {
        console.error('Update student attempt marks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateStudentAttemptMarks = updateStudentAttemptMarks;
