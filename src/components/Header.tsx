import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  onError: (error: Error) => void;
  setTempTodo: (todo: Todo | null) => void;
  onSuccess: (todos: Todo[]) => void;
  errorMessage: string;
  setIdsForStatusChange: (ids: number[]) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  onError,
  setTempTodo,
  onSuccess,
  errorMessage,
  setIdsForStatusChange,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const isAllCompleted = !todos.some(todo => !todo.completed);

  useEffect(() => {
    if (input.current && errorMessage !== 'Unable to update a todo') {
      input.current.focus();
    }
  }, [todos, errorMessage]);

  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    setTodoTitle(event.target.value);
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const trimmedTitle = todoTitle.trim();

    if (event.key === 'Enter') {
      event.preventDefault();

      if (trimmedTitle) {
        setTempTodo({
          title: trimmedTitle,
          completed: false,
          userId: USER_ID,
          id: 0,
        });
        setIsDisabled(true);
      }

      addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      })
        .then(post => {
          onSuccess([...todos, post]);
          setTodoTitle('');
        })
        .catch(message => {
          onError(message);
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  };

  const btnHandler = () => {
    setIdsForStatusChange(
      todos
        .filter(todo => todo.completed === isAllCompleted)
        .map(todo => todo.id),
    );
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={btnHandler}
        />
      )}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          autoFocus
          ref={input}
          onChange={inputHandler}
          onKeyDown={onEnter}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
