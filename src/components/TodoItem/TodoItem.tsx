/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { LoadingItem, Todo } from '../../types/Todo';
import { changeTodo, deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: (callback: (todos: Todo[]) => Todo[]) => void;
  onDelete: (id: number) => void;
  setErrorMessage: (message: string) => void;
  isLoadingItems: LoadingItem[];
  setDeleteItem: (onDelete: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  onDelete,
  setErrorMessage,
  isLoadingItems,
  setDeleteItem,
}) => {
  const { title, completed, id } = todo;

  const [checked, setChecked] = useState(false);
  const [itemEnterDone, setItemEnterDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleField, setTitleField] = useState(title);
  const [onEditField, setOnEditField] = useState(false);

  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textFieldRef.current?.focus();
  }, [onEditField]);

  const handleDelete = (idTodo: number) => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => {
        onDelete(idTodo);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setIsLoading(false), 300);
      })
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
        setDeleteItem(true);
      });
  };

  useEffect(() => {
    isLoadingItems.forEach(loadingItem => {
      if (id === loadingItem.id) {
        setIsLoading(loadingItem.isLoading);
      }
    });
  }, [isLoadingItems, id]);

  useEffect(() => {
    setChecked(completed);
    setItemEnterDone(true);
  }, [completed]);

  const handleOnChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    changeTodo(id, {
      ...todo,
      completed: event.target.checked,
    })
      .then(() => {
        setChecked(!event.target.checked);
        setItemEnterDone(false);
        setTodos(prevTodos => {
          return prevTodos.map(todoItem => {
            if (todoItem.id === id) {
              return { ...todoItem, completed: !event.target.checked };
            }

            return todoItem;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedTitle = titleField.trim();

    if (!formattedTitle) {
      return handleDelete(id);
    }

    if (formattedTitle === title) {
      return setOnEditField(false);
    }

    setIsLoading(true);

    changeTodo(id, {
      ...todo,
      title: formattedTitle,
    })
      .then(data => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            return prevTodo.id === id ? data : prevTodo;
          });
        });
        setOnEditField(false);
        setTitleField(formattedTitle);
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

  const cancelEdit = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      setTitleField(title);
      setOnEditField(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: checked,
        'item-enter-done': itemEnterDone,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={checked}
          onChange={handleOnChecked}
        />
      </label>

      {!onEditField ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setOnEditField(true)}
        >
          {titleField}
        </span>
      ) : (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={cancelEdit}
        >
          <input
            ref={textFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleField}
            onChange={event => setTitleField(event.target.value)}
          />
        </form>
      )}

      {/* Remove button appears only on hover */}
      {!onEditField && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
