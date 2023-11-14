import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';
import { ErrorContext } from '../../ErrorContext';
import { Error } from '../../types/ErrorMessage';

const ERROR_DELAY = 3000;

type Props = {
  todo: Todo;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingIds,
}) => {
  const { todos, setTodos } = useContext(TodosContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { setErrorMessage } = useContext(ErrorContext);
  const refInput = useRef<HTMLInputElement>(null);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => {
        setIsLoading(false);
        const currentTodos = [...todos];

        setTodos(currentTodos.filter(t => t.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage(Error.DELETE);
        setIsLoading(false);

        setTimeout(() => setErrorMessage(''), ERROR_DELAY);

        throw error;
      });
  };

  const updateTodo = (uTodo: Todo): Promise<void> => {
    return todoService.updateTodo(uTodo)
      .then(updatedTodo => {
        const currentTodos = [...todos];
        const index = currentTodos.findIndex(t => t.id === todo.id);

        currentTodos.splice(index, 1, updatedTodo);
        setTodos(currentTodos);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(Error.UPDATE_TODO);

        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const handleCompleteTodo = (uTodo: Todo) => {
    setIsLoading(true);
    updateTodo({ ...uTodo, completed: !todo.completed });
  };

  const handleOnBlur = (uTodo: Todo) => {
    if (editedTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (editedTitle.trim()) {
      updateTodo({ ...uTodo, title: editedTitle.trim(), completed: false })
        .then(() => setIsEditing(false));
    } else {
      deleteTodo(uTodo.id);
    }

    setIsLoading(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleOnBlur(todo);
  };

  const handleCancelEditing = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && isEditing) {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed && !isEditing },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompleteTodo(todo)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={refInput}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={() => handleOnBlur(todo)}
              onKeyUp={handleCancelEditing}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading || (loadingIds.includes(todo.id)) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
