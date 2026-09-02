const { Todo } = require('./services/todo.service');

Todo.sync({ force: true });
