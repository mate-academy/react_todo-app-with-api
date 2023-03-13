import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  onEmptyQuery: () => void;
  onSubmit: (title: string) => void;
  isDisabled: boolean;
  onUpdateAll: () => void;
};

export const Header: FC<Props> = ({
  onEmptyQuery,
  onSubmit,
  isDisabled,
  onUpdateAll,
}) => {
  const [query, setQuery] = useState('');

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current !== null) {
      input.current.focus();
    }
  }, [isDisabled]);

  const handleSubmit = (): void => {
    if (!query) {
      onEmptyQuery();
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={onUpdateAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isDisabled}
          ref={input}
        />
      </form>
    </header>
  );
};
