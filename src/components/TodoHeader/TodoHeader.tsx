/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import classNames from 'classnames';
import { TITLE_ERROR } from '../../utils/constants';
import { TodoContext } from '../../TodoContext';

type Props = {
  addTodo: (newTodoTitle: string) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({ addTodo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputLine = useRef<HTMLInputElement>(null);

  const {
    todoItems,
    setErrorMessage,
    setStatusForAll,
    uncompletedTodosLength,
  } = useContext(TodoContext);

  const handleSetStatusForAll = () => {
    setIsLoading(true);
    setStatusForAll();
    setIsLoading(false);
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNewTodoTitle = newTodoTitle.trim();

    if (!trimmedNewTodoTitle) {
      setErrorMessage(TITLE_ERROR);

      return;
    }

    setIsLoading(true);
    addTodo(trimmedNewTodoTitle)
      .then(() => setNewTodoTitle(''))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isLoading) {
      inputLine.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: !uncompletedTodosLength,
          },
        )}
        style={{ visibility: todoItems.length ? 'visible' : 'hidden' }}
        data-cy="ToggleAllButton"
        onClick={handleSetStatusForAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onTitleChange}
          disabled={isLoading}
          ref={inputLine}
        />
      </form>
    </header>
  );
};
