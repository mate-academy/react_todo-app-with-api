import { useContext, useCallback } from 'react';
import {
  AppContext,
  AppContextType,
  USER_ID,
} from '../Contexts/AppContextProvider';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const TodoAddForm = () => {
  const {
    query,
    setQuery,
    inputRef,
    isFetching,
    todos,
    setIsFetching,
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useContext(AppContext) as AppContextType;

  const postTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!query.trim()) {
        setErrorMessage('Title should not be empty');

        return;
      }

      const newTodo: Omit<Todo, 'id'> = {
        title: query.trim(),
        completed: false,
        userId: USER_ID,
      };

      try {
        setIsFetching(true);
        setTempTodo({ ...newTodo, id: 0 });

        const response = await client.post<Todo>('/todos', newTodo);

        setTodos((prev) => {
          return [...prev, response];
        });

        setQuery('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        setTodos(todos);
      } finally {
        setTempTodo(null);
        setIsFetching(false);
      }
    },
    [
      query,
      setErrorMessage,
      setIsFetching,
      setQuery,
      setTempTodo,
      setTodos,
      todos,
    ],
  );

  return (
    <form onSubmit={(e) => postTodo(e)}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isFetching}
      />
    </form>
  );
};

export { TodoAddForm };
