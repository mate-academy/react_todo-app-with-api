import React, { useState } from 'react';
import cn from 'classnames';

interface Props {
  changeError: (error: string) => void;
  addTodo: (title: string) => void;
  toggleAllTodos: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean
}

export const TodoHeader: React.FC<Props> = React.memo(({
  changeError,
  addTodo,
  toggleAllTodos,
  isAllCompleted,
  hasTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleToggleAllOnClick = () => toggleAllTodos();

  const handleFormOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      changeError('Title can\'t be empty');

      return;
    }

    addTodo(todoTitle);
    setTodoTitle('');
  };

  const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {(hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          aria-label="toggle-all"
          onClick={handleToggleAllOnClick}
        />
      ))}

      <form onSubmit={handleFormOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleOnChange}
        />
      </form>
    </header>
  );
});
