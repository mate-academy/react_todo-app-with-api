import React, { useEffect, useRef, useState } from 'react';
import './Header.scss';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  inputValue: string;
  onChangeInputValue: (inputValue: string) => void;
  setErrorMessage: (message: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  onRef?: (ref: React.RefObject<HTMLInputElement>) => void;
  onClickBtnToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputValue,
  onChangeInputValue = () => {},
  setErrorMessage,
  onAddTodo,
  onRef,
  onClickBtnToggleAll = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onRef) {
      onRef(inputRef);
    }
  }, [onRef]);

  const handleChangeInputValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChangeInputValue(event.target.value);
  };

  const handleDisabledInput = isLoading;

  const handleSubmitInputForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    onAddTodo(inputValue)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const allCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={onClickBtnToggleAll}
        />
      )}

      <form onSubmit={handleSubmitInputForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleChangeInputValue}
          ref={inputRef}
          disabled={handleDisabledInput}
        />
      </form>
    </header>
  );
};
