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
  const [loading, setLoading] = useState(false);
  const [currentTodoIds, setCurrentTodoIds] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const {
    deleteTodo,
    deletedTodos,
    updateTodo,
    updateLoading,
  } = useContext(TodoContext);

  const isShowModal = currentTodoIds.includes(todo.id)
    || (deletedTodos?.includes(todo))
    || loading
    || updateLoading
    || tempLoader;

  const todoRef = useRef<null | HTMLInputElement>(null);

  const handleDeleteTodos = async (deletedTodo: Todo) => {
    setCurrentTodoIds(todoIds => [...todoIds, deletedTodo.id]);

    await deleteTodo(todo.id);

    setCurrentTodoIds([]);
  };

  const handleUpdateTodo = async (todoToUpdate: Todo) => {
    try {
      setLoading(true);

      await updateTodo(todoToUpdate, 'completed', !todoToUpdate.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (event: React.MouseEvent) => {
    if (event.detail === 2) {
      setEditing(true);
    }
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    todoToUpdate: Todo,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setEditing(false);

      if (query === todo.title) {
        return;
      }

      if (editing && !query) {
        handleDeleteTodos(todo);
      }

      if (editing && query) {
        await updateTodo(todoToUpdate, 'title', query);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyboardClick = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setQuery(todo.title);
      setEditing(false);
    }
  };

  useEffect(() => {
    if (editing) {
      todoRef.current?.focus();
      window.addEventListener('keyup', handleKeyboardClick);
    }

    return () => {
      window.removeEventListener('keyup', handleKeyboardClick);
    };
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
          onClick={() => handleUpdateTodo(todo)}
        />
      </label>

      {!editing ? (
        <>
          <span
            className="todo__title"
            onClick={handleTitleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodos(todo)}
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
