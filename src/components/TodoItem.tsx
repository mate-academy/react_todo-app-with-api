import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<void>,
  isProcessingTodos: number[],
  isProcessing: boolean,
  editTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
  setIsProcessingTodos: React.Dispatch<React.SetStateAction<number[]>>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isProcessing,
  isProcessingTodos,
  editTodo,
  setIsProcessingTodos,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const saveEditing = () => {
    if (newTitle.trim() === '') {
      deleteTodo(todo.id);
    } else if (newTitle !== todo.title) {
      editTodo(todo.id, { title: newTitle })
        .catch(() => setNewTitle(todo.title));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);

    saveEditing();
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsProcessingTodos([]);
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => editTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
          disabled={isProcessing}
        >
          ×
        </button>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isProcessingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
