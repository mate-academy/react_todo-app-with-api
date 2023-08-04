/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';

import { TodoContext } from '../../context/TodoContext';

type Props = {
  todo: Todo;
  tempLoader?: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, tempLoader }) => {
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const {
    deleteTodo,
    deletedTodos,
    updateTodo,
    processingIds,
  } = useContext(TodoContext);

  const isShowModal = processingIds.includes(todo.id)
    || (deletedTodos?.includes(todo))
    || tempLoader;

  const todoRef = useRef<null | HTMLInputElement>(null);

  const handleFormSubmit = async (
    event: React.FormEvent,
    todoToUpdate: Todo,
  ) => {
    event.preventDefault();

    setEditing(false);

    if (query === todo.title) {
      return;
    }

    if (editing && !query.trim()) {
      deleteTodo(todo.id);
    }

    if (editing && query.trim()) {
      updateTodo(todoToUpdate, 'title', query);
    }
  };

  const handleKeyboardClick = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setQuery(todo.title);
      setEditing(false);
    }
  };

  useEffect(() => {
    if (editing) {
      todoRef.current?.focus();
    }
  }, [editing]);

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => updateTodo(todo, 'completed', !todo.completed)}
        />
      </label>

      {!editing ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={(event) => handleFormSubmit(event, todo)}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            ref={todoRef}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={(event) => handleFormSubmit(event, todo)}
            onKeyUp={handleKeyboardClick}
          />
        </form>
      )}

      {isShowModal && (
        <div className={classNames('modal overlay', {
          'is-active': isShowModal,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
