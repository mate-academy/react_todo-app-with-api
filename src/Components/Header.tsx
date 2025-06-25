/* eslint-disable no-console */
import { AddTodo, Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';
import { useMemo } from 'react';

interface Props {
  handle: () => void;
  handleAdd: (newTodo: AddTodo) => void;
  setErrorMessage: (args: string) => void;
  tempTodo: Todo | null;
  setInputValue: (args: string) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  handle,
  handleAdd,
  setErrorMessage,
  tempTodo,
  setInputValue,
  inputValue,
  inputRef,
  todos,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = inputValue.trim();

    const obgData: AddTodo = {
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    if (!trimmed) {
      setErrorMessage('Title should not be empty');

      return;
    } else {
      handleAdd(obgData);
      setErrorMessage('');
    }
  };

  const everyComleted = useMemo(
    () => todos.every(todo => todo.completed === true),
    [todos],
  );

  return (
    <>
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: everyComleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handle}
          />
        )}

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={handleChange}
            ref={inputRef}
            disabled={!!tempTodo}
          />
        </form>
      </header>
    </>
  );
};
