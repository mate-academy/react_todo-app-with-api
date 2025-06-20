import React from 'react';

interface TodoHeaderProps {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  createTodo: () => void;
  todoInOperation: number[];
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  createTodo,
  todoInOperation,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createTodo();
    }
  };

  return (
    <header className="todoapp__header">
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={todoInOperation.length > 0}
      />
    </header>
  );
};

export default TodoHeader;
