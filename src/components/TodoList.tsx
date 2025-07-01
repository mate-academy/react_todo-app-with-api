/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Todo as TodoType } from '../types/Todo';
import { Todo as TodoItem } from './Todo';

interface Props {
  todos: TodoType[];
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo: TodoType | null;
  deletingTodoId: number[];
  loadingTodoId: number[];
  startEditing: (id: number | null, currentTitle: string) => void;
  saveTitle: (id: number) => void;
  editingTodoId: number | null;
  setEditingTitle: (value: string) => void;
  editingTitle: string;
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleToggle,
  handleDelete,
  tempTodo,
  deletingTodoId,
  loadingTodoId,
  startEditing,
  saveTitle,
  editingTodoId,
  setEditingTitle,
  editingTitle,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          tempTodo={tempTodo?.id === todo.id}
          isDelete={deletingTodoId.includes(todo.id)}
          isTodoLoading={loadingTodoId.includes(todo.id)}
          startEditing={startEditing}
          saveTitle={saveTitle}
          editingTodoId={editingTodoId}
          setEditingTitle={setEditingTitle}
          editingTitle={editingTitle}
        />
      ))}
    </>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      userId: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,

  handleToggle: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,

  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    userId: PropTypes.number.isRequired,
  }),

  deletingTodoId: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,

  loadingTodoId: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,

  startEditing: PropTypes.func.isRequired,
  saveTitle: PropTypes.func.isRequired,
  editingTodoId: PropTypes.number,
  setEditingTitle: PropTypes.func.isRequired,
  editingTitle: PropTypes.string.isRequired,
};
