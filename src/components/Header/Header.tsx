import React, { memo } from 'react';
import cn from 'classnames';

interface HeaderProps {
  title: string;
  isLoading: boolean;
  hasOnlyCompletedTodos : boolean;
  onToggleAllTodos: () => void
  onAddTodo: (title: string) => void;
  onChangeTitle: (title: string) => void;
  onChangeNotification: (errorMessage: string) => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  title,
  isLoading,
  hasOnlyCompletedTodos,
  onToggleAllTodos,
  onAddTodo,
  onChangeTitle,
  onChangeNotification,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTitle(event.target.value);
  };

  const handleToggleTodos = () => {
    onToggleAllTodos();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onChangeNotification('Title can\'t be empty');

      return;
    }

    onAddTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all', {
            active: hasOnlyCompletedTodos,
          },
        )}
        onClick={handleToggleTodos}
        aria-label="Toggle Todos"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
