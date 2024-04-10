import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useTodos } from '../Store/Store';
import { USER_ID } from '../../api/todos';

const Header: React.FC = () => {
  const {
    todos,
    activeTodos,
    handleCompleteAll,
    setIsDisabled,
    setTempTodo,
    addTodo,
    isDisabled,
    errorMessages,
  } = useTodos();
  const [title, setTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [activeTodos.length, errorMessages]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalisedTitle = title.trim();

    if (!normalisedTitle.trim()) {
      errorMessages('Title should not be empty');

      return;
    }

    setIsDisabled(true);

    const tempTodo = {
      userId: USER_ID,
      completed: false,
      title: normalisedTitle,
    };

    const newTodo = {
      userId: USER_ID,
      completed: false,
      title: normalisedTitle,
      id: +new Date(),
    };

    setTempTodo({
      id: 0,
      ...tempTodo,
    });

    addTodo(newTodo)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        errorMessages('Unable to add a todo');
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={titleRef}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
