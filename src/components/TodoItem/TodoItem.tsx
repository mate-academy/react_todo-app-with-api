import React, { useRef, useState } from 'react';
import { TypeTodo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteData, updateData } from '../../api/todos';

interface Props {
  todo: TypeTodo,
  isTemp?: boolean,
  deleteLoader: boolean,
  loadingTodos: number[],
  setInputFocus: (focus: boolean) => void,
  setIsLoading: (isLoading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
}

export const TodoItem: React.FC<Props> = ({
  todo, setErrorMessage, loadingTodos,
  setTodos, setInputFocus, isTemp,
}) => {
  const { id, title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [canEdit, setCanEdit] = useState(false);
  const editRef = useRef<number | null>(null);

  const todoDeleteButton = () => {
    setIsLoading(true);
    deleteData(id)
      .then(() => {
        setTodos(currectTodos => currectTodos.filter((plan) => plan.id !== id));
        setInputFocus(true);
      })
      .catch(() => {
        setCanEdit(true);
        setErrorMessage('Unable to delete a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const handleComplete = () => {
    setIsLoading(true);
    updateData(id, 'completed', !completed)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map((plan) => {
            if (plan.id === id) {
              return {
                ...plan,
                completed: !plan.completed,
              };
            }

            return plan;
          });
        });
        setInputFocus(true);
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

  const handleChangeTitle = () => {
    if (newTitle) {
      setIsLoading(true);
      updateData(id, 'title', newTitle.trim())
        .then(() => {
          setTodos((currentTodos) => {
            return currentTodos.map((plan) => {
              if (plan.id === id) {
                return {
                  ...plan,
                  title: newTitle.trim(),
                };
              }

              return plan;
            });
          });
          setInputFocus(true);
        })
        .catch(() => {
          setCanEdit(true);
          setErrorMessage('Unable to update a todo');

          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      todoDeleteButton();
      setInputFocus(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChangeTitle();
      setCanEdit(false);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setNewTitle(title);
      setCanEdit(false);
    }
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleChangeTitle();
    setCanEdit(false);
  };

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    if (!canEdit) {
      setCanEdit(true);
      editRef.current = id;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        "todo",
        { "completed": completed, }
      )}>
      <label className="todo__status-label" htmlFor={`todo${todo.id}`}>
        <input
          id={`todo${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleComplete}
        />
      </label>

      {canEdit && editRef.current === id ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleValue}
            onKeyDown={handleKeyPress}
            onBlur={handleBlur}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {!canEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={todoDeleteButton}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isTemp || isLoading
              || loadingTodos.includes(todo.id),
          }
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
