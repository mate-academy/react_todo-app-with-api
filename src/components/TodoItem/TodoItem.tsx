import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../GlobalStateProvider/GlobalStateProvider';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const {
    setTodos,
    setErrorMessage,
    closeErrorMessage,
    inputRef,
    loaderId,
    setLoaderId,
    loaderTodosIds,
  } = useContext(TodosContext);
  const [isEditing, setIsEditing] = useState(false);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const handleTodoDelete = () => {
    setLoaderId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevState => prevState.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setLoaderId(null);

        if (inputRef) {
          inputRef.current?.focus();
        }
      });
  };

  const handleTodoDeleteOnEdit = () => {
    setLoaderId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevState => prevState.filter(t => t.id !== id));

        if (inputRef) {
          inputRef.current?.focus();
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        closeErrorMessage('');

        if (editInputRef) {
          editInputRef.current?.focus();
        }
      })
      .finally(() => {
        setLoaderId(null);
      });
  };

  const handleCompletedChange = () => {
    setLoaderId(id);
    updateTodo({ ...todo, completed: !completed })
      .then(updatedTodo => {
        setTodos(prevState => {
          const newPosts = [...prevState];
          const index = newPosts.findIndex(t => t.id === id);

          newPosts.splice(index, 1, updatedTodo);

          return newPosts;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setLoaderId(null);
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setInputValue(title);
  };

  const titleUpdate = () => {
    const trimmedValue = inputValue.trim();

    if (title === trimmedValue) {
      setIsEditing(false);
      setInputValue('');

      return;
    }

    if (!trimmedValue) {
      handleTodoDeleteOnEdit();

      return;
    }

    setLoaderId(id);
    updateTodo({ ...todo, title: trimmedValue })
      .then((updatedTodo) => {
        setTodos(prevState => {
          const newPosts = [...prevState];
          const index = newPosts.findIndex(t => t.id === id);

          newPosts.splice(index, 1, updatedTodo);

          return newPosts;
        });

        setIsEditing(false);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setLoaderId(null);
      });
  };

  const handleBlur = () => {
    titleUpdate();
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    titleUpdate();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (isEditing && editInputRef) {
      editInputRef.current?.focus();
    }
  });

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleEditSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputValue}
              ref={editInputRef}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
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
              onClick={() => {
                handleTodoDelete();
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': !id || loaderId === id || loaderTodosIds.includes(id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
