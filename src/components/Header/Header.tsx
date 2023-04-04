import cn from 'classnames';
import React, {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';

type Props = {
  setNewTodoTitle: Dispatch<SetStateAction<string>>;
  onInputError: () => void;
  toggleCompleteTodo: () => void;
  hasAllCompleted: boolean;
  disable: number[];
};

export const Header: React.FC<Props> = ({
  setNewTodoTitle,
  onInputError,
  toggleCompleteTodo,
  hasAllCompleted,
  disable,
}) => {
  const [titleInput, setTitleInput] = useState('');
  const [wasSubmited, setWasSubmited] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmited(true);

    if (titleInput.length) {
      setNewTodoTitle(titleInput);
      setTitleInput('');
    }

    if (!titleInput.length) {
      onInputError();
    }

    inputRef.current?.focus();
  };

  useEffect(() => {
    if (wasSubmited) {
      inputRef.current?.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: hasAllCompleted },
        )}
        onClick={toggleCompleteTodo}
      />

      <form onSubmit={handleTitleSubmit}>
        <input
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleInput}
          onChange={(event) => setTitleInput(event.target.value)}
          disabled={disable.length > 0}
          onBlur={() => setWasSubmited(false)}
        />
      </form>
    </header>
  );
};
