import classNames from 'classnames';
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';

import { updateTodoStatus } from '../../todos';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodoContext';

type Props = {
  todo: Todo;
};

export const TodoTitleField:React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;

  const {
    TodoDeleteButton,
    handleUpdate,
    handleError,
    updateTodo,
    loaderTodoId,
    setLoaderTodoId,
  } = useContext(TodosContext);

  const [changedTodo, setChangedTodo] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);
  const todoFocus = useRef<HTMLInputElement>(null);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTodo(event.target.value);
  };

  const handleDoubleClick = useCallback((elTitle: string) => {
    setIsEditing(true);
    setFocus(true);
    setChangedTodo(elTitle);
  }, [setIsEditing]);

  const clickEnterOrEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Enter') {
      setLoaderTodoId([todo.id]);
      if (changedTodo.trim() === '' || todo.title === '') {
        TodoDeleteButton(todo.id);
        setIsEditing(false);
      }

      const changed = { ...todo, title: changedTodo };

      handleUpdate(changed);
      setIsEditing(false);
      setLoaderTodoId(null);
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }

    setFocus(false);
  };

  const updateChecked = (todoEl: Todo) => {
    const changed = { ...todo, completed: !todo.completed };

    setLoaderTodoId([todoEl.id]);
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
    if (changedTodo.trim() === '') {
      TodoDeleteButton(todoTodo.id);
    } else {
      const changed = { ...todoTodo, title: changedTodo };

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
                onClick={() => TodoDeleteButton(todo.id)}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={
                  classNames('modal overlay',
                    { 'is-active': loaderTodoId?.includes(todo.id) })
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
              value={changedTodo}
              onChange={handleTitle}
              onBlur={() => handleBlur(todo)}
            />
          )}
      </div>
    </>
  );
};
