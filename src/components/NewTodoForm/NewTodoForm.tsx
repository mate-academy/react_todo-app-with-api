import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  addTodosOnServer: (query: string) => Promise<void>;

};

export const NewTodoForm:React.FC<Props> = React.memo(({
  addTodosOnServer,
}) => {
  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [counter, setCounter] = useState(0);

  const handlerSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsDisabled(true);
      setQuery('');
      addTodosOnServer(query).finally(() => {
        setIsDisabled(false);
        setQuery('');
        setCounter((prev) => prev + 1);
      });
    }, [query],
  );

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (counter) {
      ref.current?.focus();
    }
  }, [counter]);

  return (
    <form onSubmit={(event) => handlerSubmit(event)}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={((event) => setQuery(event.target.value))}
        disabled={isDisabled}
        ref={ref}
      />
    </form>
  );
});
