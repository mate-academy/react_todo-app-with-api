import classNames from 'classnames';
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

export const Header = ({
  todos,
  createTodo,
  onToggleAll: handleTogleAll,
  setErrorMessage,
  inputRef,
}: {
  todos: Todo[];
  createTodo: (title: string) => Promise<boolean>;
  onToggleAll: () => Promise<boolean>;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  inputRef: RefObject<HTMLInputElement>;
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [inputRef, loading]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      setLoading(true);

      createTodo(trimmedTitle)
        .then(success => {
          if (success) {
            setTitle('');
          }
        })
        .catch(() => {
          setErrorMessage(Errors.UnableToAddTodo);
        })
        .finally(() => setLoading(false));
    } else {
      setErrorMessage(Errors.TitleShouldNotBeEmpty);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          disabled={loading}
          className={classNames('todoapp__toggle-all', {
            active:
              todos.length === todos.filter(todo => todo.completed).length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            setLoading(true);

            handleTogleAll()
              .catch(() => setErrorMessage(Errors.UnableToUpdateTodo))
              .finally(() => setLoading(false));
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
