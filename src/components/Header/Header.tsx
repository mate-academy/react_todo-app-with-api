/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useMemo, useState } from 'react';
import cn from 'classnames';

import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../utils/TodosContext';
import { ErrorContext } from '../../utils/ErrorContextProvider';

interface Props {
  onAdd: (val: Todo) => Promise<void>;
  onToggleAll: () => void;
  userId: number;
}

export const Header: React.FC<Props> = ({
  userId,
  onAdd,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');

  const { todos } = useContext(TodosContext);
  const { showError } = useContext(ErrorContext);

  const hasActiveTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.length) {
      showError(Errors.Empty);

      return;
    }

    onAdd({
      title,
      userId,
      completed: false,
      id: 0,
    })
      .finally(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !hasActiveTodos })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
