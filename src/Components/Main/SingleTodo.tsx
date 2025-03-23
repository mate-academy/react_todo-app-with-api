/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEventHandler, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { patchTodoCompleteness } from '../../api/todos';
import { ERROR, ErrorType } from '../../types/Error';

type Props = {
  todo: Todo;
  setTodos: (todos: Todo[]) => void;
  todos: Todo[];
  handleDeletion: (todoId: number) => void;
  isLoading: boolean;
  toggleCompleted: (todoId: number, data: Todo) => void;
  setIsLoading: (value: React.SetStateAction<number[]>) => void;
  setErrorType: (error: ErrorType) => void;
};

export const SingleTodo: React.FC<Props> = ({
  todo,
  handleDeletion,
  isLoading,
  toggleCompleted,
  setIsLoading,
  setTodos,
  todos,
  setErrorType,
}) => {
  const [beingEdited, setBeingEdited] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  const todoClassName = classNames('todo', { completed: todo.completed });
  const modalClassName = classNames('modal', 'overlay', {
    'is-active': isLoading,
  });

  const handleEdit = () => {
    setBeingEdited(true);
  };

  const handleEditSubmit: FormEventHandler = event => {
    event.preventDefault();
    if (newTitle === todo.title) {
      setBeingEdited(false);

      return;
    }

    if (newTitle.trim() === '') {
      handleDeletion(todo.id);

      return;
    }

    setIsLoading(prev => [...prev, todo.id]);
    patchTodoCompleteness(todo.id, { ...todo, title: newTitle.trim() })
      .then(() => {
        setTodos(
          todos.map(task =>
            task.id === todo.id ? { ...todo, title: newTitle.trim() } : task,
          ),
        );
        setBeingEdited(false);
      })
      .catch(() => setErrorType(ERROR.unableToUpdate))
      .finally(() => setIsLoading(prev => prev.filter(id => id !== todo.id)));
  };

  return (
    <>
      <div data-cy="Todo" className={todoClassName}>
        <label className="todo__status-label">
          <input
            onClick={() =>
              toggleCompleted(todo.id, {
                ...todo,
                completed: !todo.completed,
              })
            }
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>
        {!beingEdited ? (
          <>
            {' '}
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleEdit}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDeletion(todo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <input
              onKeyUp={event => event.key === 'Escape' && setBeingEdited(false)}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleEditSubmit}
              autoFocus
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
            />
          </form>
        )}
        <div data-cy="TodoLoader" className={modalClassName}>
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
