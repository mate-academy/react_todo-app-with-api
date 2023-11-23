import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoHeaderProps } from './types/TodoHeaderProps';

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  isSubmitting,
  todoInput,
  setTodoInput,
  handleAddTodo,
  focusRef,
  toggleAllTodos,
  isUpdatingAll,
  todos,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setIsClicked(todos.every(todo => todo.completed));
  }, [todos]);

  const shouldShowToggleAllButton = !isUpdatingAll && todos.length > 0;

  return (
    <header className="todoapp__header">
      {shouldShowToggleAllButton && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isClicked })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all todos"
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={handleAddTodo}>
        <input
          disabled={isSubmitting}
          ref={focusRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
        />
      </form>
    </header>
  );
};
