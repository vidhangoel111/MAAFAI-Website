const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/pending-requests', ...adminController.getPendingRequests);
router.post('/approve-student', ...adminController.approveStudent);
router.post('/reject-student', ...adminController.rejectStudent);
router.get('/students', ...adminController.getStudents);
router.post('/delete-student', ...adminController.deleteStudent);
router.get('/batches', ...adminController.getBatches);
router.post('/create-batch', ...adminController.createBatch);
router.post('/delete-batch', ...adminController.deleteBatch);
router.post('/assign-student', ...adminController.assignStudent);
router.post('/update-content', ...adminController.updateContent);

module.exports = router;
