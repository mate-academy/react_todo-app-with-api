import React from 'react';
import { Todo } from '../../types/Todo';
import { ChangeTodosStatus } from '../ChangeTodosStatus';

type Props = {
  isAdding: boolean,
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  newTitle: string,
  handleNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  toggleAllTodos: () => void,
  isAllTodoCompleted: boolean
  todos: Todo[],
};

export const AddTodoField:React.FC<Props> = ({
  isAdding,
  handleAddTodo,
  newTodoField,
  newTitle,
  handleNewTitle,
  toggleAllTodos,
  isAllTodoCompleted,
  todos,
}) => (
  <header className="todoapp__header">
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    {todos.length > 0 && (
      <ChangeTodosStatus
        toggleAllTodos={toggleAllTodos}
        isAllTodoCompleted={isAllTodoCompleted}
      />
    )}

    <form onSubmit={handleAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        disabled={isAdding}
        onChange={(event) => handleNewTitle(event)}
      />
    </form>
  </header>
);
