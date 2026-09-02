const todoService = require('../services/todo.service.js');

exports.get = async (req, res) => {
  const todos = await todoService.getAll();
  res.send(await todos.map(todo => todoService.normalize(todo)));
};

exports.getOne = async (req, res) => {
  const todo = await todoService.getById(req.params.id);

  if (!todo) {
    res.sendStatus(404);

    return;
  }

  res.send(todoService.normalize(todo));
};

exports.create = async (req, res) => {
  const { title, userId } = req.body;

  if (!title || !title.trim()) {
    res.sendStatus(422);
    return;
  }

  const todo = await todoService.create({ title: title.trim(), userId });

  res.status(201).send(todo);
};

exports.remove = async (req, res) => {
  const deleted = await todoService.remove(req.params.id);

  if (!deleted) {
    res.sendStatus(404);

    return;
  }

  res.sendStatus(204);
};

exports.update = async (req, res) => {
  const { title, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    res.sendStatus(422);
    return;
  }

  const todo = await todoService.update(req.params.id, { title, completed });

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
};

exports.removeMany = async (req, res, next) => {
  if (req.query.action !== 'delete') {
    next();
    return;
  }

  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  res.send(todoService.removeMany(ids));
  return;
};

exports.updateMany = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  res.send(todoService.updateMany(items));
};
