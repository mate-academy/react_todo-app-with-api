import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { id, title, completed } = todoItem;
  const {
    setErrorMessage,
  } = useContext(TodosContext);
  const { deleteTodo, editTodo } = useContext(TodoUpdateContext);

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleCheckbox = async () => {
    try {
      setLoading(true);

      const updatedTodo = { ...todoItem, completed: !completed };

      await editTodo(updatedTodo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            completed,
          })}
          checked={completed}
          onChange={handleCheckbox}
          disabled={loading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader id={id} />
    </div>
  );
};
