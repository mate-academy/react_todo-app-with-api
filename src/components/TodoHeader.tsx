import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/Error';
import { USER_ID } from '../utils/USER_ID';

type Props = {
  todos: Todo[],
  onUpdate: (todo: Todo) => Promise<void>,
  onAdd: (todo: Omit<Todo, 'id'>) => Promise<void>,
  onError: (error: ErrorMessage) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos, onUpdate, onAdd, onError,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isSomeVisible = useMemo(() => !!todos.length, [todos]);
  const isEveryCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleNewTitleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsLoading(true);

    onAdd({
      title: newTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(() => setNewTitle(''))
      .finally(() => setIsLoading(false));
  };

  const handleCompleteAllButton = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed === isEveryCompleted) {
        onUpdate({ ...todo, completed: !todo.completed });
      }
    });
  }, [todos, isEveryCompleted]);

  return (
    <header className="todoapp__header">
      {isSomeVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryCompleted,
          })}
          onClick={handleCompleteAllButton}
          aria-label="Toggle all completed"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleNewTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
