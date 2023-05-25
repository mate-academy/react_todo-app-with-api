/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  memo,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { useTodoContext } from '../../TodoContext/TodoContext';
import { USER_ID } from '../../consfig';
import { NewError } from '../../types/ErrorsList';
import { createTodo, updateTodo } from '../../api/todos';

export const Header: FC = memo(() => {
  const {
    todos,
    setVisibleError,
    setTempTodo,
    setTodos,
    isTodosNoEmpty,
    setIsUpdatingEveryStatus,
    isEveryTotoCompleted,
  } = useTodoContext();

  const [query, setQuery] = useState('');

  const handleUpdateAllTodos = useCallback(async () => {
    setIsUpdatingEveryStatus(true);
    try {
      await Promise.all(
        todos.map((todo) => updateTodo({
          ...todo,
          completed: !isEveryTotoCompleted,
        })),
      );

      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !isEveryTotoCompleted,
      })));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setIsUpdatingEveryStatus(false);
    }
  }, [todos]);

  const handleSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (query.trim() === '') {
      setVisibleError(NewError.Title);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setVisibleError(NewError.Add);
    } finally {
      setTempTodo(null);
    }

    setQuery('');
  }, [query]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return (
    <header className="todoapp__header">
      {isTodosNoEmpty && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: isEveryTotoCompleted,
            },
          )}
          onClick={handleUpdateAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
});
