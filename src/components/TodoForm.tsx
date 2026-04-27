import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/enums/ErrorMessage';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  onAdd: (arg0: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
  setAllCompleted: () => Promise<void[]>;
  todos: Todo[];
};

export const TodoForm: React.FC<Props> = ({
  onAdd,
  setError,
  setAllCompleted,
  todos,
}) => {
  const isToggleAllActive =
    todos.length > 0 &&
    todos.length === todos.filter(todo => todo.completed).length;

  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = value.trim();

    setIsDisabled(true);

    if (normalizedTitle.length === 0) {
      setIsDisabled(false);

      return setError(ErrorMessage.emptyTitle);
    }

    return onAdd(normalizedTitle)
      .then(() => {
        setValue('');
      })
      .finally(() => {
        setIsDisabled(false);
      });
  };

  return (
    <>
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={setAllCompleted}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={handleInput}
          disabled={isDisabled}
        />
      </form>
    </>
  );
};
