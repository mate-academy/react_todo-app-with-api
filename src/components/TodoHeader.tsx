import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  newTodoInput: string;
  setNewTodoInput: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  handleSwitchTodos: (handleType: string) => void;
  newInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  newTodoInput,
  setNewTodoInput,
  addTodo,
  isLoading,
  handleSwitchTodos,
  newInputRef,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleClick = () => {
    if (activeTodos.length === 0) {
      handleSwitchTodos('makeAllActive');
    } else {
      handleSwitchTodos('makeAllCompleted');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleClick()}
        />
      )}

      <form
        onSubmit={event => {
          addTodo(event);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoInput}
          onChange={event => setNewTodoInput(event.target.value)}
          ref={newInputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
