import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  setTodoInOperation: React.Dispatch<React.SetStateAction<number[]>>;
  todoInOperation: number[];
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  setTodoInOperation,
  todoInOperation,
  editingId,
  setEditingId,
  newTitle,
  setNewTitle,
  inputRef,
  setErrorMessage,
}) => {
  const handleEditClick = () => {
    setEditingId(todo.id);
    setNewTitle(todo.title);
  };

  const handleBlurOrKeyDown = (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, id: number) => {
    // Logic for handling blur or Enter key events goes here
  };

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleToggle(todo.id)}
      />
      {editingId === todo.id ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={(e) => handleBlurOrKeyDown(e, todo.id)}
          onKeyDown={(e) => handleBlurOrKeyDown(e, todo.id)}
          autoFocus
          ref={inputRef}
        />
      ) : (
        <span onDoubleClick={handleEditClick}>{todo.title}</span>
      )}
      <button onClick={() => deleteTodo(todo.id)}>×</button>
    </div>
  );
};

export default TodoItem;
