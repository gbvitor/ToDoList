const express = require('express');
const tasksController = require('./controllers/tasksController');
const tasksMiddleware = require('./middlewares/tasksMiddleware');
const router = express.Router();
router.get('/tasks', tasksController.getAll);
router.post(
  '/tasks',
  tasksMiddleware.validateFieldBody,
  tasksController.createTasks
);
router.delete('/tasks/:id', tasksController.deleteTask);
router.put(
  '/tasks/:id',
  tasksMiddleware.validateFieldBody,
  tasksMiddleware.validateFieldStatus,
  tasksController.updateTask
);
module.exports = router;
