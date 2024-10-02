import React, { useRef, useEffect } from 'react';

interface NewTodoProps {
  onAddTodo: (title: string) => void;
  isSubmit: boolean;
  title: string;
  handleSetTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isHeaderFocus: boolean;
}

const NewTodo: React.FC<NewTodoProps> = ({
  onAddTodo,
  isSubmit,
  title,
  handleSetTitle,
  isHeaderFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmit) {
      inputRef.current?.focus();
    }
  }, [isSubmit, title]);

  useEffect(() => {
    if (isHeaderFocus) {
      inputRef.current?.focus();
    }
  }, [isHeaderFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onAddTodo(title.trim());
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => handleSetTitle(e)}
          autoFocus
          disabled={isSubmit}
        />
      </form>
    </header>
  );
};

export default NewTodo;
