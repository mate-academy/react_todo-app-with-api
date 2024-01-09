import { FC, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  showFocus: boolean;
  showToggle: boolean;
  itemCount: number;
  onClickToggle: () => void;
  submitForm: (arg: string) => Promise<void>;
};

export const Header: FC<Props> = ({
  showFocus,
  showToggle,
  itemCount,
  onClickToggle,
  submitForm,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!showFocus) {
    inputRef.current?.focus();
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm(value).then(() => setValue(''));
  };

  return (
    <header className="todoapp__header">
      {showToggle && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: !itemCount },
          )}
          data-cy="ToggleAllButton"
          aria-label="toggle all button"
          onClick={onClickToggle}
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleOnChange}
          value={value}
          disabled={showFocus}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
