import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  isTodosPresent: boolean;
  newTodoTitle: string
  handleNewTodoTitleChange:
  (newTitle: React.ChangeEvent<HTMLInputElement>) => void;
  addNewTodo: (title: string) => Promise<Todo | null>;
  isAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
}

export const TodoHeader: React.FC<Props> = (
  {
    isTodosPresent,
    newTodoTitle,
    handleNewTodoTitleChange,
    addNewTodo,
    isAllTodosCompleted,
    toggleAllTodos,
  },
) => {
  const [isAdding, setIsAdding] = useState(false);

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAdding(true);

    await addNewTodo(newTodoTitle);

    setIsAdding(false);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {isTodosPresent && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
          aria-label="Show todos"
          onClick={() => toggleAllTodos()}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => handleNewTodoTitleChange(event)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
