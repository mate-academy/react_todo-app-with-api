import cn from 'classnames';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  todo: Todo
  setTodos: (toggle: Todo[]) => void
  deleted: () => void
  loadingTodosIds: number[]
  editedTodo: (newTodo: Todo) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleted,
  todos,
  setTodos,
  loadingTodosIds,
  editedTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const loaded = loadingTodosIds.includes(todo.id);
  const toggleTodo = (id: number) => {
    const toggle = todos.map(todoItem => (todoItem.id === id
      ? { ...todoItem, completed: !todoItem.completed } : todoItem));

    setTodos(toggle);
  };

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleEditSave = () => {
    if (editTitle.trim() !== '') {
      if (editTitle !== todo.title) {
        const updatedTodo = { ...todo, title: editTitle };

        editedTodo(updatedTodo);
      }

      setEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (editTitle.trim() === '' && event.key === 'Enter') {
      deleted();

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setEditTitle(todo.title);
      handleEditSave();
    }

    if (event.key === 'Enter') {
      handleEditSave();
    }
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => toggleTodo(todo.id)}
        />
      </label>

      {editing ? (
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEditSave}
          ref={inputRef}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={deleted}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', { 'is-active': loaded })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
