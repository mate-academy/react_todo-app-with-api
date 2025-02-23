/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { useCallback, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (id: number) => Promise<void>;
  handleEditTodo: (todoId: number, data: Todo) => Promise<void>;
  newTodoInput: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  isLoading,
  handleDelete,
  handleEditTodo,
  newTodoInput,
}) => {
  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const editingInput = useRef<HTMLInputElement>(null);

  const handleDeleteButton = useCallback(
    (idToDelete: number) => {
      handleDelete(idToDelete).finally(() => {
        if (newTodoInput.current) {
          newTodoInput.current.focus();
        }
      });
    },
    [handleDelete, newTodoInput],
  );

  const handleCheck = useCallback(
    () =>
      handleEditTodo(id, {
        id,
        userId: USER_ID,
        title: title,
        completed: !completed,
      }),
    [handleEditTodo, id, title, completed],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    },
    [],
  );

  const handleDoubleClick = useCallback(() => {
    setIsBeingEdited(true);
    setNewTitle(title);
    setTimeout(() => {
      if (editingInput.current) {
        editingInput.current.focus();
      }
    }, 0);
  }, [title]);

  const handleSubmit = useCallback(
    (
      e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
      changedTitle: string,
    ) => {
      e.preventDefault();

      if (changedTitle.trim() === title) {
        setIsBeingEdited(false);

        return;
      }

      if (changedTitle === '') {
        handleDelete(id)
          .then(() => {
            if (newTodoInput.current) {
              newTodoInput.current.focus();
            }
          })
          .catch(caughtError => {
            if (editingInput.current) {
              editingInput.current.focus();
            }

            throw caughtError;
          });
      } else {
        handleEditTodo(id, {
          id,
          userId: USER_ID,
          title: changedTitle.trim(),
          completed,
        })
          .then(() => {
            setIsBeingEdited(false);
          })
          .catch(caughtError => {
            if (editingInput.current) {
              editingInput.current.focus();
            }

            throw caughtError;
          });
      }
    },
    [handleDelete, handleEditTodo, newTodoInput, id, completed, title],
  );

  const handleEscPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsBeingEdited(false);
        setNewTitle('');
      }
    },
    [],
  );

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleCheck}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={e => handleSubmit(e, newTitle)}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={e => handleSubmit(e, newTitle)}
            onKeyUp={e => handleEscPress(e)}
            ref={editingInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteButton(id)}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
