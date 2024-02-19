/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { patchTodos, postTodos } from '../../api/todos';
import { TodoContext } from '../State/TodoContext';
import { USER_ID } from '../../utils/userId';

export const Header: React.FC = () => {
  const {
    setTodos,
    todos,
    isError,
    setIsError,
    isFocused,
    setIsFocused,
    setErrorText,
    setTempToDo,
    setHandleDeleteTodoId,
    query,
    setQuery,
  } = useContext(TodoContext);

  const allTodosToggle = todos.every(todo => todo.completed);
  const trimmedQuery = query.trim();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (trimmedQuery === '') {
      setIsError(true);
      setErrorText('Title should not be empty');

      return;
    }

    const tempTodo = {
      id: 0,
      title: trimmedQuery,
      completed: false,
      userId: USER_ID,
    };

    setTempToDo(tempTodo);

    setIsFocused(true);

    postTodos({ userId: USER_ID, completed: false, title: trimmedQuery })
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setQuery('');
        setIsError(false);
        setTempToDo(null);
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to add a todo');
      })
      .finally(() => {
        setIsFocused(false);
        setTempToDo(null);
      });
  };

  const handleToggleAll = () => {
    const someCompleted = todos.some(todo => !todo.completed);
    const allCompleted = todos.every(todo => todo.completed);

    const newTodos = todos.map(todo => ({
      ...todo,
      completed: someCompleted,
    }));

    setTodos(newTodos);

    setHandleDeleteTodoId(todos.map(todo => todo.id));
    // const incompleteTodos = todos.filter(todo => !todo.completed);
    // const preparedTodos = allCompleted ? todos : incompleteTodos;
    const preparedTodos = allCompleted
      ? [...todos]
      : todos.filter(todo => !todo.completed);

    const promises = preparedTodos.map(todo => patchTodos(todo.id, {
      userId: todo.userId,
      title: todo.title,
      completed: someCompleted,
    }));

    Promise.all(promises)
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to update a todo');
      })
      .finally(() => setHandleDeleteTodoId([]));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosToggle })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isFocused}
        />
      </form>
    </header>
  );
};
