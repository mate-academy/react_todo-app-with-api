/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ChangeField, Todo } from '../types/Todo';

type Props = {
  addNewTodo: (ard: string) => void,
  todos: Todo[],
  onChange: (id: number, todoField: ChangeField) => void,

};

export const Header: React.FC<Props> = ({ addNewTodo, todos, onChange }) => {
  const [input, setInput] = useState<string>('');
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFormDisabled(true);

    await addNewTodo(input);

    setIsFormDisabled(false);
    setInput('');
  };

  const isActive = useMemo(() => (
    todos.some(({ completed }) => completed === false)
  ), [todos]);

  const handleTodosChange = useCallback(() => {
    todos.forEach(({ id, completed }) => {
      if (completed === false && isActive) {
        onChange(id, { completed: true });
      }

      if (!isActive) {
        onChange(id, { completed: false });
      }
    });
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
        onClick={handleTodosChange}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleInput}
          disabled={isFormDisabled}
        />
      </form>
    </header>
  );
};
