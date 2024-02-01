import classNames from 'classnames';
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';

import { deleteTodo, updateTodoStatus } from '../../todos';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodoContext';

type Props = {
  todo: Todo;
};

export const TodoTitleField:React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;

  const {
    handleUpdate,
    handleError,
    updateTodo,
    setLoaderTodoId,
    loaderTodoId,
    setTodos,
    setError,
  } = useContext(TodosContext);

  const [changedTitle, setChangedTitle] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);
  const todoFocus = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleDeleteTodo = useCallback(() => {
    setLoaderTodoId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(
          (cur: Todo[]) => cur.filter(element => element.id !== todo.id),
        );
      })
      .catch(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        window.setTimeout(() => {
          setError('Unable to delete a todo');
        }, 3000);
      })
      .finally(() => {
        setLoaderTodoId(null);
        setIsDeleting(false);
      });
  }, [isDeleting]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleDoubleClick = useCallback((elTitle: string) => {
    setIsEditing(true);
    setFocus(true);
    setChangedTitle(elTitle);
  }, [setIsEditing]);

  const clickEnterOrEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Enter') {
      setLoaderTodoId(todo.id);
      if (changedTitle.trim() === '' || todo.title === '') {
        handleDeleteTodo();
        setIsEditing(false);
      }

      if (todo.title === changedTitle) {
        setIsEditing(false);
      }

      const changed = { ...todo, title: changedTitle };

      handleUpdate(changed);
      setIsEditing(false);
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }

    setLoaderTodoId(null);
    setFocus(false);
  };

  const updateChecked = (todoEl: Todo) => {
    const changed = { ...todo, completed: !todo.completed };

    setLoaderTodoId(todoEl.id);
    updateTodoStatus(changed.id, changed.completed)
      .then(() => {
        updateTodo(changed);
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setLoaderTodoId(null);
      });
  };

  const handleBlur = (todoTodo: Todo) => {
    if (changedTitle.trim() === '') {
      handleDeleteTodo();
    } else {
      const changed = { ...todoTodo, title: changedTitle };

      handleUpdate(changed);
    }

    setIsEditing(false);
    setFocus(false);
  };

  useEffect(() => {
    if (todoFocus.current && focus) {
      todoFocus.current.focus();
    }
  }, [isEditing, focus]);

  return (
    <>
      <div
        key={id}
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => updateChecked(todo)}
          />
        </label>
        {!isEditing
          ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo.title)}
              >
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo()}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={
                  classNames('modal overlay',
                    {
                      'is-active': isDeleting
                    || loaderTodoId === todo.id,
                    })
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          )
          : (
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder={title || 'Empty todo will be deleted'}
              ref={todoFocus}
              onKeyUp={clickEnterOrEsc}
              value={changedTitle}
              onChange={handleTitle}
              onBlur={() => handleBlur(todo)}
            />
          )}
      </div>
    </>
  );
};
