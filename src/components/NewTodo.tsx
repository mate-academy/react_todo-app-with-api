import { useState } from 'react';

interface NewTodoProps {
  onTodoAdd: (newTodoTitle: string) => Promise<void>;
}

export const NewTodo = ({ onTodoAdd }: NewTodoProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  return (
    <form onSubmit={() => {
      if (newTodoTitle) {
        onTodoAdd(newTodoTitle)
          .finally(() => setNewTodoTitle(''));
      }
    }}
    >
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
