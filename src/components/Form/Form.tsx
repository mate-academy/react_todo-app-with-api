import { FC, useEffect, useState } from 'react';

import { useAppContext, useFormSubmit } from '../../hooks';

export const Form: FC = () => {
  const { inputRef } = useAppContext();

  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const { onFormSubmit } = useFormSubmit();

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, inputRef]);

  return (
    <form onSubmit={e => onFormSubmit(e, query, setQuery, setIsLoading)}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        name="title"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isLoading}
      />
    </form>
  );
};
