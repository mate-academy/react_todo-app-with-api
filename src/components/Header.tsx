/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { USER_ID } from '../constants';
import { createTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const [shouldNotFocusInput, setShouldNotFocusInput] = useState(true);

  const myInput = useRef<HTMLInputElement>(null);

  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    loadingTodo,
    setLoadingTodo,
  } = useContext(TodoContext);

  useEffect(() => {
    if (myInput.current && shouldNotFocusInput) {
      myInput.current.focus();
    }
  }, [shouldNotFocusInput, loadingTodo]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setLoadingTodo(newTodo as Todo);

    createTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos((prev) => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Error.Add))
      .finally(() => {
        setLoadingTodo(null);
        setTempTodo(null);
      });
  };

  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const handleToggleTodos = () => {
    setShouldNotFocusInput(false);

    const todosToUpdate = uncompletedTodos.length
      ? uncompletedTodos
      : todos;

    todosToUpdate.forEach((todo) => {
      setLoadingTodo(todo);

      const updatedStatus = !todo.completed;

      updateTodo(todo.id, { completed: updatedStatus })
        .then(() => setTodos((prev) => prev
          .map((prevTodo) => ({ ...prevTodo, completed: updatedStatus }))))
        .catch(() => setErrorMessage(Error.Update))
        .finally(() => setLoadingTodo(null));
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: uncompletedTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          ref={myInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          disabled={!!loadingTodo}
        />
      </form>
    </header>
  );
};
