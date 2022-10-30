import classNames from 'classnames';
import { RefObject, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorTypes } from '../types/Error';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  setErrorMessage: (error: string) => void,
  isAdding:boolean,
  onAddTodo: (str: string) => void,
  toggleAllTodos: () => void,
  activeTodos: Todo[] | [],
};

export const Header: React.FC<Props> = ({
  newTodoField,
  setErrorMessage,
  isAdding,
  onAddTodo,
  toggleAllTodos,
  activeTodos,
}) => {
  const [inputTitle, setInputTitle] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputTitle.trim().length) {
      setErrorMessage(ErrorTypes.TitleIsEmpty);

      return;
    }

    await onAddTodo(inputTitle);
    setInputTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle-all-button"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeTodos.length === 0 },
        )}
        onClick={toggleAllTodos}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={handleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
