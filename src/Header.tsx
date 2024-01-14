import { useEffect, useRef, useState } from 'react';
import { addTodos, updateAllTodos } from './api/todos';
import { Todo } from './types/Todo';

type Props = {
  setErrorMessage: (error: string) => void;
  userId: number;
  setTodos: (todo: Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  todos: Todo[];
  temp: Todo | null;
  setLoadingAll: (loading: boolean) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  userId,
  setTodos,
  setTempTodo,
  todos,
  temp,
  setLoadingAll,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [temp]);

  const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId,
      title: title.trim(),
      completed: false,
    };

    const temTodo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(temTodo);
    setIsLoading(true);

    addTodos(newTodo)
      .then((todo) => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTitle(title.trim());
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleAllTodos = () => {
    setLoadingAll(true);
    const newStatus = !todos.every((todo) => todo.completed);
    // eslint-disable-next-line max-len
    const promises = todos.map((todo) => updateAllTodos(userId, todo.id, newStatus));

    Promise.all(promises)
      .then((updatedTodos) => setTodos(updatedTodos as Todo[]))
      .catch(() => setErrorMessage('Unable to update all todos'))
      .finally(() => setLoadingAll(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="toggleALL"
        onClick={handleAllTodos}
      />

      <form onSubmit={(e) => handleInput(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
