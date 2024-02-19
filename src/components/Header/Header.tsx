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
    if (inputRef.current && !isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

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
    const allCompleted = todos.every(todo => todo.completed);
    const idCompleted = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const newTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(newTodos);

    const promises = todos.map(todo => patchTodos(todo.id, {
      userId: todo.userId,
      title: todo.title,
      completed: !allCompleted,
    }));

    Promise.all(promises)
      .then(() => {
        setHandleDeleteTodoId(prev => [...prev, ...idCompleted]);
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to update a todo');
      })
      .finally(() => {
        setHandleDeleteTodoId(prev => prev.filter(
          id => !idCompleted.includes(id),
        ));
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosToggle })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

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
