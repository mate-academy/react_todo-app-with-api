import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoHeaderProps = {
  todos: Todo[];
  todoInputValue: string;
  setTodoInputValue: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  toggleAllTodos: (makeCompleted: boolean) => Promise<boolean[]>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  todoInputValue,
  setTodoInputValue,
  addTodo,
  isLoading,
  toggleAllTodos,
  inputRef,
}) => {
  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    toggleAllTodos(!areAllTodosCompleted);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          aria-label="Toggle all todos"
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInputValue}
          onChange={handleInputChange}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
