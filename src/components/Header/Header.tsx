import {
  FC, useEffect, useRef, useState,
} from 'react';
import { Error } from '../../types/Error';

type Props = {
  addTodo: (title: string) => Promise<void>,
  showError: (error: string) => void,
  toogleCompletedTodo: () => void,
};

export const Header: FC<Props> = ({
  addTodo,
  showError,
  toogleCompletedTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isTitleDisabled, seTIsitleDisabled] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [isTitleDisabled]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      showError(Error.NotAdd);

      return;
    }

    seTIsitleDisabled(true);
    addTodo(title)
      .then(() => setTodoTitle(''))
      .finally(() => {
        seTIsitleDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle Button"
        onClick={toogleCompletedTodo}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={isTitleDisabled}
          ref={todoTitleRef}
        />
      </form>
    </header>
  );
};
