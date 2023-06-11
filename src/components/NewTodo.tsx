import { useState } from 'react';

interface NewTodoProps {
  onTodoAdd: (newTodoTitle: string) => Promise<void>;
}

export const NewTodo = ({ onTodoAdd }: NewTodoProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleTodoSubmit = (event: React.FormEvent) => {
    if (newTodoTitle) {
      event.preventDefault();
      onTodoAdd(newTodoTitle)
        .finally(() => setNewTodoTitle(''));
    }
  };

  return (
    <form onSubmit={handleTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
      />
    </form>
  );
};
