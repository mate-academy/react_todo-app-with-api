import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import './Header.scss';

type Props = {
  onSubmit: () => void;
  isDisabled: boolean;
  onUpdateAll: () => void;
  isButtonActive: boolean;
  textFieldValue: string;
  handleTextFieldValue: (value: string) => void;
};

export const Header: FC<Props> = ({
  onSubmit,
  isDisabled,
  onUpdateAll,
  isButtonActive,
  textFieldValue,
  handleTextFieldValue,
}) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current !== null) {
      input.current.focus();
    }
  }, [isDisabled]);

  return (
    <header className="App__header Header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'Header__toggle-all',
          { active: isButtonActive },
        )}
        onClick={onUpdateAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      >
        <input
          type="text"
          className="Header__new-todo"
          placeholder="What needs to be done?"
          value={textFieldValue}
          onChange={(event) => handleTextFieldValue(event.target.value)}
          disabled={isDisabled}
          ref={input}
        />
      </form>
    </header>
  );
};
