import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ActionType } from '../../types/ActionType';
import { DispatchContext } from '../TodosContext/TodosContext';

type Props = {
  todo: Todo,
  setErrorMessage: (str: string) => void,
  loadingByDefault?: boolean,
  focusMainInput: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setErrorMessage,
  loadingByDefault = false,
  focusMainInput,
}) => {
  const { title, completed, id } = todo;

  const reducer = useContext(DispatchContext);

  const [isChecked, setIsChecked] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(loadingByDefault);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSetCompleted = () => {
    setIsLoading(true);

    updateTodo(id, { completed: !isChecked, userId: 11562 })
      .then(() => {
        setIsChecked(!isChecked);

        reducer({ type: ActionType.SetCompleted, payload: id });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteClick = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        reducer({ type: ActionType.Delete, payload: id });

        focusMainInput();
      })
      .catch(() => {
        if (!isEditing) {
          focusMainInput();
        }

        setErrorMessage('Unable to delete a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleFormSubmit = () => {
    setIsLoading(true);

    updateTodo(id, { title: editedTitle.trim(), userId: 11562 })
      .then(() => {
        setEditedTitle(editedTitle.trim());

        reducer({
          type: ActionType.EditTitle,
          payload: { id, title: editedTitle.trim() },
        });

        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBlur = () => {
    if (editedTitle.trim() === '') {
      handleDeleteClick();
    } else {
      if (editedTitle === title) {
        setIsEditing(false);

        return;
      }

      handleFormSubmit();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: isChecked,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleSetCompleted}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={(e) => handleKeyUp(e)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
