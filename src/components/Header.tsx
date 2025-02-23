import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

export enum UpdatingStatus {
  inProgres = 'inProgres',
  success = 'success',
  failed = 'failed',
}

type Props = {
  onAdd: (value: string) => void;
  status: UpdatingStatus;
  isAllCompleted: boolean;
  hasTodos: boolean;
  onToggleAllCompleted: (completed: boolean) => void;
};

export const Header: React.FC<Props> = ({
  onAdd,
  status,
  isAllCompleted,
  hasTodos,
  onToggleAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
    if (status === UpdatingStatus.success) {
      setTitle('');
    }
  }, [status]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(title);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAllCompleted(!isAllCompleted)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={status === UpdatingStatus.inProgres}
        />
      </form>
    </header>
  );
};
