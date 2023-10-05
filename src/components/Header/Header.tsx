import {
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { USER_ID, useTodosContext } from '../TodosContext';

export const Header = () => {
  const [title, setTitle] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);

  const {
    todos,
    setTempTodo,
    setErrorMessage,
    updateAllCheckbox,
    addTodo,
  } = useTodosContext();

  const isAllTodosActive = todos.every(({ completed }) => completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, disabledInput]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prerapedTitle = title.trim();

    if (!prerapedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setDisabledInput(true);
    setTempTodo({
      id: 0,
      title: prerapedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo(prerapedTitle)
      .then(() => {
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage(error);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosActive,
          })}
          data-cy="ToggleAllButton"
          onClick={updateAllCheckbox}
          aria-label="Toggle all button"
        />
      )}
      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
