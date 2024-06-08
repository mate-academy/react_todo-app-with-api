/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Context } from '../Context/Context';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isTemp = false,
  inputRef,
}) => {
  const {
    setTodos,
    setErrorMessage,
    todosIdsToDelete,
    setTodosToDelete,
    toggleAllLoaderIds,
    setToggleAllLoaderIds,
  } = useContext(Context);

  const { title, id, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const [loader, setLoader] = useState(false);

  const handleChangeOfTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleDelete = () => {
    setLoader(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prev => prev.filter(item => item.id !== todo.id));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const handleChangeSubmit = () => {
    if (changedTitle.trim() !== title) {
      setLoader(true);

      if (changedTitle.trim() === '') {
        handleDelete();
      } else {
        updateTodo({ title: changedTitle.trim() }, id)
          .then(updatedTodo => {
            setTodos(prev => {
              const prevTodos = [...prev];
              const index = prevTodos.findIndex(t => t.id === updatedTodo.id);

              prevTodos.splice(index, 1, updatedTodo);

              return prevTodos;
            });
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoader(false);
            setIsEditing(false);
            setChangedTitle(changedTitle.trim());
          });
      }
    }
  };

  const eventListenerKeyboard = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChangeSubmit();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setChangedTitle(title.trim());
    }
  };

  const switchCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setLoader(true);

    updateTodo({ completed: !completed }, id)
      .then(updatedTodo => {
        setTodos(prev => {
          const prevTodos = [...prev];
          const index = prevTodos.findIndex(t => t.id === updatedTodo.id);

          prevTodos.splice(index, 1, updatedTodo);

          return prevTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    todosIdsToDelete.forEach((idToDelete, index) => {
      if (todo.id === idToDelete) {
        handleDelete();
        setTodosToDelete(prev => prev.filter((_, i) => i !== index));
      }
    });
  }, [todosIdsToDelete, todo.id, setTodosToDelete]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('keyup', eventListenerKeyboard);
    } else {
      document.removeEventListener('keyup', eventListenerKeyboard);
    }

    return () => {
      document.removeEventListener('keyup', eventListenerKeyboard);
    };
  }, [isEditing]);

  useEffect(() => {
    const idExists = toggleAllLoaderIds.includes(todo.id);

    if (idExists) {
      setLoader(true);
      setToggleAllLoaderIds(prev =>
        prev.filter(idToToggle => id !== idToToggle),
      );
    } else {
      setLoader(false);
    }
  }, [toggleAllLoaderIds]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label htmlFor={`checked-${id}`} className="todo__status-label">
        <input
          id={`checked-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={switchCompleted}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
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
        </>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleChangeSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={handleChangeOfTitle}
            onBlur={() => {
              handleChangeSubmit();
              setIsEditing(false);
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': !todo || isTemp || loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
