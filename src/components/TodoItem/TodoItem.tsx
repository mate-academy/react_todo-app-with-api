import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo?: Todo;
  tempTodo?: Todo;
  deleteTodo?: (todoId: number) => Promise<void>;
  updateTodo?: (todo: Todo) => Promise<void>;
  loadingTodoIds?: number[];
};
export const TodoItem: React.FC<Props> = (
  {
    todo,
    tempTodo,
    deleteTodo,
    updateTodo,
    loadingTodoIds,
  },
) => {
  const [title, setTitle] = useState<string>(todo?.title
    || tempTodo?.title
    || '');

  const [editing, setEditing] = useState(false);

  const deleteTodoHandler = () => {
    if (deleteTodo && todo) {
      deleteTodo(todo.id);
    }
  };

  const toggleTodoHandler = () => {
    if (updateTodo && todo) {
      updateTodo({ ...todo, completed: !todo.completed });
    }
  };

  const onDoubleClickHandler = () => setEditing(true);

  const cancelEditing = () => {
    setEditing(false);
    setTitle(todo?.title
      || tempTodo?.title
      || '');
  };

  const onBlurHandler = () => {
    if (updateTodo && todo) {
      updateTodo({ ...todo, title });
    }

    setEditing(false);
  };

  const onKeyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      if (deleteTodo && todo) {
        try {
          await deleteTodo(todo.id);
        } catch (error) {
          setTitle(todo.title);
        }
      }

      setEditing(false);

      return;
    }

    if (updateTodo && todo) {
      try {
        await updateTodo({ ...todo, title });
      } catch (error) {
        setTitle(todo.title);
      }
    }

    setEditing(false);
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo?.completed || tempTodo?.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed || tempTodo?.completed}
          onChange={toggleTodoHandler}
        />
      </label>

      {!editing ? (
        <>
          <span className="todo__title" onDoubleClick={onDoubleClickHandler}>
            {
              title
            }
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodoHandler}
          >
            ×
          </button>
        </>

      ) : (
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={onBlurHandler}
            onKeyUp={onKeyUpHandler}
          />
        </form>
      )}

      <div
        className={
          classNames('modal overlay', {
            'is-active': (todo?.id && loadingTodoIds?.includes(todo?.id))
              || tempTodo,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
