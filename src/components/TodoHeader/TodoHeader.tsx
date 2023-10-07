/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { UNABLE_UPDATE_TODO } from '../../utils/constans';

type Props = {
  todos: Todo[];
  onTodoAdd:(todoTiele:string)=> Promise<void>;
  onTodoAddError: (errorMessage:string) => void;
  isAllCompleted: boolean;
  onToogleAll: () => void;
  setErrorMessage: (text: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onTodoAdd,
  onTodoAddError,
  isAllCompleted,
  onToogleAll,
  setErrorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onTitleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onFormSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preperedTodoTitle = todoTitle.trim();

    if (!preperedTodoTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    onTodoAdd(preperedTodoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(UNABLE_UPDATE_TODO);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToogleAll}
        />
      )}

      <form
        onSubmit={onFormSubmit}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
