/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorTypes } from '../types/ErrorTypes';
import { TodoContext } from './TodoContext';

const USER_ID = 11959;

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    todos,
    addTodo,
    updateTodo,
    setErrorType,
  } = useContext(TodoContext);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading, todos.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorType(ErrorTypes.EmptyTitle);
      setTimeout(() => {
        setErrorType(ErrorTypes.None);
      }, 3000);

      return;
    }

    if (todos.some(todo => todo.title === title)) {
      setErrorType(ErrorTypes.DuplicateTodoError);
      setTimeout(() => {
        setErrorType(ErrorTypes.None);
      }, 3000);

      return;
    }

    setIsLoading(true);

    addTodo({
      userId: USER_ID, title: title.trim(), completed: false,
    })
      .then(() => setTitle(''))
      .finally(() => setIsLoading(false));
  };

  const isAllCompleted = todos.every(todo => todo.completed);
  const isAllActive = todos.every(todo => !todo.completed);

  const handleToggleAll = () => {
    if (isAllCompleted || isAllActive) {
      todos.map(todo => updateTodo(({ ...todo, completed: !todo.completed })));
    } else {
      todos.filter(todo => !todo.completed)
        .map(todo => updateTodo(({ ...todo, completed: true })));
    }
  };

  return (
    <header className="todoapp__header">

      {!!todos.length && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!isLoading}
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
