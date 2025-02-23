import { useEffect, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onAdd: (title: string) => void;
  setError: (eror: Errors) => void;
  resetFlag: number;
  loadingFlag: boolean;
  onToggleAll: () => void;
};

export const TodoHead: React.FC<Props> = ({
  todos,
  onAdd,
  setError,
  resetFlag,
  loadingFlag,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const inputElem = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElem.current) {
      inputElem.current.focus();
    }
  }, []);

  useEffect(() => {
    setTitle('');
  }, [resetFlag]);

  useEffect(() => {
    if (!loadingFlag && inputElem.current) {
      inputElem.current.focus();
    }
  }, [loadingFlag, resetFlag]);

  const handleOnsubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (cleanTitle.length <= 0) {
      setError(Errors.title);
    } else {
      onAdd(cleanTitle);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={handleOnsubmit}>
        <input
          ref={inputElem}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loadingFlag}
        />
      </form>
    </header>
  );
};
