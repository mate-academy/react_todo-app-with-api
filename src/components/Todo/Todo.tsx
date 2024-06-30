import { useEffect, useRef, useState } from 'react';
import { TodoType } from '../../types/Todo.type';

export interface TodoProps {
  todo: TodoType;
  deleteTodo: (todoId: number) => void;
  updateTodo: (updatedTodo: TodoType) => Promise<boolean>;
}

export const Todo: React.FC<TodoProps> = ({ todo, deleteTodo, updateTodo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (todo.id === 0) {
      setIsLoading(true);
    }
  }, [todo.id]);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id);
  };

  const sendUpdatedTodo = () => {
    setEditingTodo(editingTodo.trim());

    if (todo.title === editingTodo) {
      setIsEditing(false);

      return;
    }

    if (editingTodo === '') {
      handleDelete();

      return;
    }

    setIsLoading(true);

    const updatedTodo = { ...todo, title: editingTodo };

    updateTodo(updatedTodo).then(isSuccess => {
      if (isSuccess) {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }

      setIsLoading(false);
    });
  };

  const toggleCompleted = () => {
    setIsLoading(true);

    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo).then(() => {
      setIsLoading(false);
    });
    setIsEditing(false);
  };

  const handleBlur = () => {
    sendUpdatedTodo();
  };

  const handleKeyEvent = (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
    switch (keyEvent.key) {
      case 'Enter':
        keyEvent.preventDefault();
        sendUpdatedTodo();
        break;
      case 'Escape':
        setEditingTodo(todo.title);
        setIsEditing(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTodo(event.target.value);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
        key={todo.id}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
          <input
            id={`todo-${todo.id}`}
            name={`todo-${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={toggleCompleted}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTodo}
              onBlur={handleBlur}
              onKeyDown={handleKeyEvent}
              onChange={handleChange}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {editingTodo}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading ? 'is-active' : ''} `}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
