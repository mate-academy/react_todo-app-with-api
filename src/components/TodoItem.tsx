import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';
import { Error } from '../types/Error';
import { Keys } from '../types/Keys';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  toggleTodo: (id: number) => void,
  setTemptTodo: (tempTodo: Todo | null) => void,
  setTodos: (todos: Todo[]) => void,
  setError: (error: Error | null) => void,
  todos: Todo[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodo,
  setTemptTodo,
  setTodos,
  setError,
  todos,
}) => {
  const { title, completed, id } = todo;

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitile] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    if (inputRef.current) {
      inputRef.current.value = title;
    }
  };

  const completeEditing = () => {
    setEditing(false);

    if (newTitle !== title) {
      setTemptTodo({
        ...todo,
        title: newTitle,
      });
    }

    todosService.updateTodo(id, newTitle)
      .then((updatedTodo) => {
        const updatedTodos = todos
          .map(t => (t.id === id ? updatedTodo : t));

        setTodos(updatedTodos as Todo[]);
      })
      .catch(() => {
        setError(Error.UnableToUpdate);
      })
      .finally(() => {
        setTemptTodo(null);
      });
  };

  const handleOnBlur = () => {
    if (newTitle.trim() === '') {
      deleteTodo(id);
    } else {
      completeEditing();
    }
  };

  const handleKeys = (event: React.KeyboardEvent) => {
    if (event.key === Keys.Enter) {
      completeEditing();
    } else if (event.key === Keys.Escape) {
      setEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >

      <label className="todo__status-label" id={todo.id.toString(10)}>
        <input
          data-cy="TodoStatus"
          id={todo.id.toString(10)}
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(id)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleOnBlur}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(e) => setNewTitile(e.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={handleKeys}
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
