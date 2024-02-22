/* eslint-disable operator-linebreak */
import classNames from 'classnames';
import { useContext, useState } from 'react';
import { TodoLoader } from './TodoLoader';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import * as TodoClient from '../api/todos';
import { ErrorsMessage } from '../types/ErrorsMessage';
import { TodoEdit } from './TodoEdit';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id, title, completed } = todo;
  const {
    deleteTodo,
    updateTodo,
    handleSetErrorMessage,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);

  const handleDeleteTodo = (deleteTodoID: number) => {
    handleUpdatingTodosIds(deleteTodoID);

    TodoClient.deleteTodo(deleteTodoID)
      .then(() => deleteTodo(deleteTodoID))
      .catch(() => handleSetErrorMessage(ErrorsMessage.Delete))
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleCompleteTodo = (updatedTodo: Omit<Todo, 'userId'>) => {
    handleUpdatingTodosIds(updatedTodo.id);

    TodoClient.updateTodo(updatedTodo)
      .then(() => updateTodo(updatedTodo))
      .catch(() => handleSetErrorMessage(ErrorsMessage.Update))
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleEditMode = (value: boolean) => {
    setIsEditing(value);
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => handleEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() =>
            handleCompleteTodo({ id, title, completed: !completed })
          }
        />
      </label>

      {isEditing ? (
        <TodoEdit todo={todo} onEdit={handleEditMode} />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>

          <TodoLoader id={id} />
        </>
      )}
    </li>
  );
};
