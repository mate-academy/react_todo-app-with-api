import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { updatedTodo } from './api/todos';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleting?: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodo: (todoId: number) => void
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  // isEditing: boolean;
  // setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  isDeleting,
  isLoading,
  setIsLoading,
  toggleTodo,
  setTodoTitle,
  // isEditing,
  // setIsEditing,
}) => {
  const showLoader = (todo.id === 0 && isLoading) || (isDeleting && isLoading);
  const [editableTitle, setEditableTitle] = useState(todo.title);
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const updateTodoTitle = async (
    todoId: number, newTitle: string,
  ) => {
    setIsLoading(true);
    try {
      const updatedData = { ...todo, title: newTitle };

      await updatedTodo(todoId, updatedData);

      setIsLoading(false);
      setTodoTitle(newTitle); // Update the title state in the component
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      setIsLoading(false);
      // Handle error, display message
      alert('Unable to update a todo');
    }
  };

  const handleToggle = () => {
    toggleTodo(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editableTitle === title) {
      setIsEditing(false);
    } else if (!editableTitle.trim()) {
      deleteTodo(id);
    } else {
      updateTodoTitle(id, editableTitle); // implement this function for API call
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editableTitle !== title && editableTitle.trim()) {
      updateTodoTitle(id, editableTitle); // implement this function for API call
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditableTitle(title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : 'active'}`}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={editableTitle}
            // className="todo__title"
            className="todoapp__new-todo"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            // className="todo__title"
            className="todoapp__new-todo"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
