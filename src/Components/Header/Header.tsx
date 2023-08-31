import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Error, ErrorMessage } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  onEmptyForm: React.Dispatch<React.SetStateAction<Error>>,
  isDisabled: boolean,
  onAdd: (todo: string) => void,
  statusPost: boolean,
  todos: Todo[],
  completedAll: () => void,
};

const Header: FC<Props> = ({
  onEmptyForm,
  isDisabled,
  onAdd,
  statusPost,
  todos,
  completedAll,
}) => {
  const [inputValue, setInputValue] = useState('');

  const hendlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setInputValue(value);
  };

  const hendlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue === '') {
      onEmptyForm({
        status: true,
        message: ErrorMessage.EMPTYFORM,
      });

      return;
    }

    onAdd(inputValue);
  };

  useEffect(() => {
    if (statusPost) {
      setInputValue('');
    }
  }, [statusPost]);

  const hendlerToggleAllCompleted = () => {
    completedAll();
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.every(todo => todo.completed === true) },
          )}
          onClick={hendlerToggleAllCompleted}
        />
      )}

      <form onSubmit={hendlerSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={hendlerInput}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
