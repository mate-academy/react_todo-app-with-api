import {
  Dispatch, SetStateAction, useEffect, useRef,
} from 'react';
import { Error } from '../../types/Error';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<Error>>;
  isLoading: boolean;
  addTodo: () => Promise<void>;
};

export const Header:React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  isLoading,
  addTodo,
  setError,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle) {
      setError(Error.TitleError);

      return;
    }

    addTodo()
      .then(() => {
        setNewTodoTitle('');
      });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [newTodoTitle]);

  return (
    <header className="todoapp__header">
      {/*  eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
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
          value={newTodoTitle}
          disabled={isLoading}
          onChange={(event) => {
            setNewTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
