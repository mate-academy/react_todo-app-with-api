import React, { useEffect, useRef, useState } from 'react';

type Props = {
  addTodo: () => Promise<void>,
  query: string,
  setQuery: (v: string) => void,
  disabled: boolean,
};

export const NewTodo: React.FC<Props> = React.memo(({
  addTodo, query, setQuery, disabled,
}) => {
  const [focus, setFocus] = useState(false);
  const thisTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus && thisTodo.current) {
      thisTodo.current.focus();
    }
  }, [focus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFocus(false);

    addTodo().finally(() => setFocus(true));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={thisTodo}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={handleChange}
        disabled={disabled}
      />
    </form>
  );
});
