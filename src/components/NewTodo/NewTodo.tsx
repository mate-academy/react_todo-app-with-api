import React, { useRef } from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  hasTodos: boolean;
  handleLoadTodos: () => void;
  query: string;
  setQuery: (string: string) => void;
  setIsEditing: (arg0: boolean) => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  hasTodos,
  handleLoadTodos,
  query,
  setQuery,
  setIsEditing,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = React.useContext(AuthContext);

  const addNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.length >= 1) {
      setIsEditing(true);
      if (user) {
        await createTodo(query, user.id);
        handleLoadTodos();
        setQuery('');
      }
    }
  };

  const toggleAll = async () => {
    await Promise.all(
      todos.map((todo: { id: number; completed: boolean }) => updateTodo(
        todo.id, { completed: !todo.completed }
      )),
    );
    handleLoadTodos();
  };

  return (
    <>
      {hasTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </>
  );
};
