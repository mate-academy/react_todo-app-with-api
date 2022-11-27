import React, { useRef } from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  handleLoadTodos: () => void;
  query: string;
  OnQuery: (string: string) => void;
  OnEditing: (arg0: boolean) => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  handleLoadTodos,
  query,
  OnQuery,
  OnEditing,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = React.useContext(AuthContext);

  const addNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    if (query.length >= 1) {
      OnEditing(true);
      if (user) {
        await createTodo(query.trim(), user.id);
        handleLoadTodos();
        OnQuery('');
      }
    }
  };

  const toggleAll = async (newStatus: boolean) => {
    await Promise.all(
      todos.map((todo: { id: number; completed: boolean }) => updateTodo(
        todo.id, { completed: newStatus },
      )),
    );
    handleLoadTodos();
  };

  return (
    <>
      {todos.length !== 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          onClick={() => toggleAll(true)}
        />
      )}

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          value={query}
          onChange={(event) => OnQuery(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </>
  );
};
