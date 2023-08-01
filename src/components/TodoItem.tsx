import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  deleteTodoById: (todoId: number) => void,
  isLoading: boolean,
  completedTodos: Todo[],
  updateTodo: (currentTodo: Todo) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoById,
  isLoading,
  completedTodos,
  updateTodo,
}) => {
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDeleteTodo = (todoForDelete: Todo) => {
    deleteTodoById(todoForDelete.id);
  };

  const setTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (setTitleField.current) {
      setTitleField.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.currentTarget?.value;

    setTitle(newTitle);
  };

  const keyUpEvents = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  const handleNewTitleSubmit = (
    event: React.FormEvent,
    currentTodoForChange: Todo,
    newTitle: string,
  ) => {
    event.preventDefault();

    if (todo.title === title) {
      return;
    }

    if (title.trim().length === 0) {
      setCurrentTodo(todo);
      deleteTodoById(todo.id);

      return;
    }

    updateTodo({ ...currentTodoForChange, title: newTitle });
  };

  const onDoubleClickEvent = (currentElement: Todo) => {
    setIsEditing(true);
    setTitle(currentElement.title);
  };

  const onBlurEvent = (currentElement: Todo) => {
    setIsEditing(false);
    setTitle(currentElement.title);
  };

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
          onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>
      {isEditing ? (
        <form onSubmit={(event) => handleNewTitleSubmit(event, todo, title)}>
          <input
            type="text"
            onBlur={() => onBlurEvent(todo)}
            ref={setTitleField}
            onKeyUp={(event) => keyUpEvents(event)}
            className="todo__title-field"
            value={title}
            onChange={handleTitleChange}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => onDoubleClickEvent(todo)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodo(todo)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div className={classNames('modal', 'overlay', {
        'is-active': (isLoading && todo.id === currentTodo?.id)
          || (isLoading && completedTodos.includes(todo)),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
