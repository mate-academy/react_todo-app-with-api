import {
  FC,
  useContext,
  useEffect,
} from 'react';
import cn from 'classnames';
import { addTodo } from '../../api/todos';
import { USER_ID } from '../../utils/constants';
import { Todo } from '../../types/Todo';
import { waitToClose } from '../../utils/hideErrorWithDelay';
import { ErrorMessage } from '../../context/TodoError';
import { LoaddingProvider } from '../../context/Loading';

type TSearchFieldProps = {
  hasTodos: boolean;
  searchValue: string;
  inputFieldRef: { current: HTMLInputElement | null }
  allTodoCompleted: boolean;
  hasAddTodoErrorTimerId: { current: number }
  handleToggleButton: () => void;
  setTodos: (newTodo: ((prev: Todo[]) => Todo[])) => void
  setTempTodo: (newTodo: Todo | null) => void
  setSearchValue: (newValue: string) => void;
};

export const SearchField: FC<TSearchFieldProps> = ({
  setSearchValue,
  searchValue,
  allTodoCompleted,
  hasTodos,
  setTodos,
  inputFieldRef,
  setTempTodo,
  hasAddTodoErrorTimerId,
  handleToggleButton,
}) => {
  const { setErrorMessage } = useContext(ErrorMessage);
  const { isLoading, setIsLoading } = useContext(LoaddingProvider);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidSearchValue = !searchValue || searchValue.trim() === '';

    if (isValidSearchValue) {
      setErrorMessage('Title should not be empty');

      // eslint-disable-next-line no-param-reassign
      hasAddTodoErrorTimerId.current = waitToClose(3000, setErrorMessage);

      return;
    }

    (async () => {
      const newTodo = {
        title: searchValue.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        setIsLoading(true);

        const todoFromServer = await addTodo(newTodo);

        setIsLoading(false);
        setSearchValue('');
        setTempTodo(null);
        setTodos((prevTodos) => [...prevTodos, todoFromServer]);
      } catch (errorSubmit) {
        // eslint-disable-next-line no-console
        console.warn(errorSubmit);
        setIsLoading(false);
        setTempTodo(null);

        setErrorMessage('Unable to add a todo');

        // eslint-disable-next-line no-param-reassign
        hasAddTodoErrorTimerId.current = waitToClose(3000, setErrorMessage);
      }
    })();
  };

  const handleSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodoCompleted,
          })}
          onClick={handleToggleButton}
          data-cy="ToggleAllButton"
          aria-label="toggle button"
        />
      )}

      <form
        onSubmit={handleSubmitForm}
      >
        <input
          ref={inputFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchValue}
          onChange={handleSearchValue}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
