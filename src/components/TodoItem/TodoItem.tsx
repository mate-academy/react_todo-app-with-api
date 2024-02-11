import { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import * as TodoClient from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { TodoEditForm } from '../TodoEditForm';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id, title, completed } = todo;

  const {
    deleteTodo,
    updateTodo,
    handleSetErrorMessage,
    handleUpdatingTodosIds,
    updatingTodosIds,
  } = useContext(TodoContext);

  const handleDeleteTodo = (deletedTodoId: number) => {
    handleUpdatingTodosIds(deletedTodoId);

    TodoClient.deleteTodo(deletedTodoId)
      .then(() => deleteTodo(deletedTodoId))
      .catch(() => handleSetErrorMessage(ErrorMessage.Delete))
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleCompleteTodo = (updatedTodo: Omit<Todo, 'userId'>) => {
    handleUpdatingTodosIds(updatedTodo.id);

    TodoClient.updateTodo(updatedTodo)
      .then(() => updateTodo(updatedTodo))
      .catch(() => handleSetErrorMessage(ErrorMessage.Update))
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleEditMode = (value: boolean) => {
    setIsEditing(value);
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => handleEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleCompleteTodo({
            id,
            title,
            completed: !completed,
          })}
        />
      </label>

      {isEditing ? (
        <TodoEditForm
          todo={todo}
          onEdit={handleEditMode}
        />
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

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': updatingTodosIds.includes(id),
            })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </>
      )}
    </li>
  );
};
