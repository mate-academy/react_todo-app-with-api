import { useEffect, useRef, useState } from 'react';
import { Errors, Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  query: string;
  todos: Todo[];
  changeQuery: (query: string) => void;
  setTodoError: (errorMessege: string) => void;
  setSearchInput: (searchInput: React.RefObject<HTMLInputElement>) => void;
  addNewTodo: () => void;
  updateCompletedAllToDo: () => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  query,
  todos,
  changeQuery,
  setTodoError,
  addNewTodo,
  setSearchInput,
  updateCompletedAllToDo,
}) => {
  const [isShowToggleButton, setIShowToggleButton] = useState<boolean>(false);
  const [isActiveTodos, setIsActiveTodos] = useState<boolean>(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const setDisabledSearchInput = (isDisabled: boolean): void => {
    if (searchInput.current) {
      searchInput.current.disabled = isDisabled;
    }
  };

  useEffect(() => {
    setSearchInput(searchInput);
    searchInput.current?.focus();
  }, [setSearchInput]);

  useEffect(() => {
    if (todos.length !== 0) {
      setIShowToggleButton(true);
      setIsActiveTodos(!todos.some(tod => !tod.completed));
    } else {
      setIShowToggleButton(false);
    }
  }, [todos]);

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') {
      setTodoError(Errors.EMPTY);

      return;
    }

    setDisabledSearchInput(true);
    try {
      await addNewTodo();
      changeQuery('');
    } catch (err) {}

    setDisabledSearchInput(false);
    searchInput.current?.focus();
  };

  const toggleAllHandler = async () => {
    await updateCompletedAllToDo();
  };

  return (
    <header className="todoapp__header">
      {isShowToggleButton && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isActiveTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllHandler}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandle}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={searchInput}
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => {
            changeQuery(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
