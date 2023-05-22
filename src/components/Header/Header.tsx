import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { Error } from '../../types/Errors';
// import { AddTodoForm } from '../AddTodoForm';
import { Todo } from '../../types/Todo';

const USER_ID = 10353;

interface Props {
  onAddTodo: (newTodo: Todo) => void;
  onToggleAll: () => void;
  onError: (error: string) => void;
  activeTodosLength: number;
}

export const Header: React.FC<Props> = ({
  onAddTodo,
  onToggleAll,
  onError,
  activeTodosLength,
}) => {
  const [query, setQuery] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      onError(Error.EMPTYTITLE);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title: query,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    onAddTodo(tempTodo);
    setQuery('');
    setIsInputDisabled(false);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosLength,
        })}
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
