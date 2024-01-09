import React, { useEffect, useRef } from 'react';
import { TodoError } from '../../enum/TodoError/TodoError';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMesage: (value: string) => void,
  sendTodo: ({ title, completed }: Omit<Todo, 'userId' | 'id'>) => void,
  queryInput: string,
  setQueryInput: (value: string) => void,
  allCompleted: () => void,
  isLoader: boolean,
};

export const Header: React.FC<Props> = ({
  setErrorMesage,
  sendTodo,
  queryInput,
  setQueryInput,
  allCompleted,
  isLoader,
}) => {
  const inputField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [queryInput]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) {
      setErrorMesage(TodoError.TitleEmpti);

      return;
    }

    sendTodo({
      title: queryInput,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="new-field"
        onClick={allCompleted}
      />

      <form
        onSubmit={onSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          disabled={isLoader}
        />
      </form>
    </header>
  );
};
