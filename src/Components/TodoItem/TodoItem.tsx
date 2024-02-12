/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Actions, DispatchContext, Keys } from '../Store';
import { deleteData, updateTodo } from '../../api/todos';

interface Props {
  todo: Todo,
  loaderActive: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loaderActive,
}) => {
  const dispatch = useContext(DispatchContext);
  const { id, title, completed } = todo;
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(loaderActive);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputToogle = () => {
    setIsUpdating(true);
    updateTodo({ id, completed: !completed, title })
      .then(() => {
        dispatch({
          type: Actions.mark,
          todo: {
            ...todo,
            completed,
          },
        });
      })
      .catch(() => {
        dispatch({ type: Actions.setUpdatingError });
      })
      .finally(() => {
        setIsUpdating(false);
      });
    dispatch({
      type: Actions.mark,
      todo,
    });
  };

  const deleteTodo = () => {
    setIsUpdating(true);
    deleteData(id)
      .then(() => {
        dispatch({
          type: Actions.destroy,
          todo,
        });
      })
      .catch(() => {
        dispatch({ type: Actions.setDeletingError });
      }).finally(() => {
        setIsUpdating(false);
      });
  };

  const validateTitle = () => {
    setIsEditing(false);
    if (!currentTitle.trim()) {
      setIsUpdating(true);
      deleteTodo();
    } else if (title !== currentTitle.trim()) {
      setIsUpdating(true);
      updateTodo({
        id,
        title: currentTitle,
        completed,
      })
        .then((newTodo) => {
          setCurrentTitle(newTodo.title);
          dispatch({
            type: Actions.edit,
            todo: {
              ...todo,
              title: currentTitle,
            },
          });
        })
        .catch(() => {
          dispatch({ type: Actions.setUpdatingError });
          setCurrentTitle(title);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    } else {
      setCurrentTitle(title);
    }
  };

  const handleTodoEditKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keys.Escape) {
      setIsEditing(false);
    } else if (event.key === Keys.Enter) {
      validateTitle();
    }
  };

  const handleEditingInputBlur = () => {
    validateTitle();
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id="toggle-view"
          onChange={handleInputToogle}
          checked={completed}
        />
      </label>
      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {currentTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Save"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            placeholder="Empty todo will be deleted"
            type="text"
            className="todo__title-field"
            value={currentTitle}
            onChange={handleTodoChange}
            onKeyUp={handleTodoEditKey}
            onBlur={handleEditingInputBlur}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay ', {
          'is-active': isUpdating || loaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
