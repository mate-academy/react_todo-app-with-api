import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (title: string) => void;
  onInput: () => void;
  inputDisabled: boolean;
  isAllCompleted: boolean;
  onToggleAll: () => void;
  hasError: boolean;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onInput,
  inputDisabled,
  hasError,
  isAllCompleted,
  onToggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(title);
    if (!hasError) {
      setTitle('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onInput();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={titleField}
          type="text"
          disabled={inputDisabled}
          value={title}
          onChange={handleInputChange}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
