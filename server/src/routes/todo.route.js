const express = require('express');
const todoController = require('../controllers/todo.controller.js');

const router = express.Router();

router.get('/todos', todoController.get);

router.get('/todos/:id', todoController.getOne);

router.post('/todos', todoController.create);

router.delete('/todos/:id', todoController.remove);

router.patch('/todos/:id', todoController.update);

const isAction = action => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();
      return;
    } else {
      next('route');
    }
  };
};

router.patch('/todos', isAction('delete'), todoController.removeMany);
router.patch('/todos', isAction('update'), todoController.updateMany);

module.exports = router;
