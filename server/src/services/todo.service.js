const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db.js');
const { DataTypes, DATE } = require('sequelize');

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'todos',
    timestamps: false,
  },
);

const normalize = ({ id, userId, title, completed }) => {
  return {
    id,
    userId,
    title,
    completed,
  };
};

const getAll = async userId => {
  const where = userId ? { userId: Number(userId) } : {};

  const todos = await Todo.findAll({
    where,
    order: [['title', 'ASC']],
  });

  return todos;
};

const getById = async id => {
  return Todo.findByPk(id);
};

const create = async ({ title, userId }) => {
  const todo = await Todo.create({
    userId: userId || 4239,
    title,
    completed: false,
  });
  return todo;
};

const update = async (id, changes) => {
  const todo = await Todo.findByPk(id);

  if (!todo) {
    return null;
  }

  if (changes.title !== undefined) todo.title = changes.title;
  if (changes.completed !== undefined) todo.completed = changes.completed;

  await todo.save();
  return todo;
};

const remove = async id => {
  const deleteCount = await Todo.destroy({ where: { id } });
  return deleteCount > 0;
};

const removeMany = async ids => {
  await Todo.destroy({ where: { id: ids } });
  return Todo.findAll();
};

const updateMany = async todos => {
  return sequelize.transaction(async t => {
    for (const { id, title, completed } of todos) {
      await Todo.update(
        { title, completed },
        { where: { id }, transaction: t },
      );
    }
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  removeMany,
  updateMany,
  normalize,
  Todo,
};
