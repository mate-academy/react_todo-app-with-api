/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { TodoListContext } from '../variables/LangContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { updateTodo, deleteTodo, loadingTodoIds, updateTodoTitle } =
    useContext(TodoListContext);

  const [titleHiddenForm, setTitleHiddenForm] = useState(todo.title || '');
  const [showForm, setShowForm] = useState(false);

  const inpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inpRef.current) {
      inpRef.current.focus();
    }
  });

  const handleTitleHiddenForm = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleHiddenForm(event.target.value);
  };

  const onBlurSubmit = () => {
    if (todo.title === titleHiddenForm) {
      setShowForm(false);

      return;
    }

    if (titleHiddenForm === '') {
      deleteTodo(todo.id);
    } else {
      if (inpRef.current) {
        inpRef.current.disabled = true;
      }

      updateTodoTitle({ ...todo, title: titleHiddenForm }, titleHiddenForm)
        .then(() => {
          setShowForm(false);
        })
        .catch(() => {
          setShowForm(true);
          if (inpRef.current) {
            inpRef.current.disabled = false;
            inpRef.current.focus();
          }
        });
      if (inpRef.current) {
        inpRef.current.disabled = false;
      }
    }
  };

  const handleHiddenFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todo.title === titleHiddenForm) {
      setShowForm(false);

      return;
    }

    if (titleHiddenForm === '') {
      deleteTodo(todo.id);
    } else {
      if (inpRef.current) {
        inpRef.current.disabled = true;
      }

      updateTodoTitle({ ...todo, title: titleHiddenForm }, titleHiddenForm)
        .then(() => {
          setShowForm(false);
        })
        .catch(() => {
          setShowForm(true);
          if (inpRef.current) {
            inpRef.current.disabled = false;
            inpRef.current.focus();
          }
        });
      if (inpRef.current) {
        inpRef.current.disabled = false;
      }
    }
  };

  const handleDoubleClick = () => {
    setShowForm(true);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo(todo)}
          checked={todo.completed}
        />
      </label>

      {showForm && (
        <form onSubmit={handleHiddenFormSubmit}>
          <input
            type="text"
            placeholder="Empty todo will be deleted"
            className="todoapp__additional-todo"
            value={titleHiddenForm}
            onChange={handleTitleHiddenForm}
            onBlur={onBlurSubmit}
            ref={inpRef}
          />
        </form>
      )}
      {!showForm && (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title.trim()}
        </span>
      )}
      {!showForm && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
