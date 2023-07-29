import { useState } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  activeTodosCount: number;
  onSubmit: (title: string) => void;
  setEmptyValueErr: (value: ErrorType | null) => void;
  onToggle: (status: boolean) => void;
};

export const Header: React.FC<Props> = ({
  activeTodosCount, onSubmit, setEmptyValueErr, onToggle,
}) => {
  const [titleQuery, setTitleQuery] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
    setEmptyValueErr(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleQuery.trim()) {
      setEmptyValueErr(ErrorType.EMPTY);
    } else {
      onSubmit(titleQuery);
      setTitleQuery('');
    }
  };

  const handleToggle = () => {
    onToggle(activeTodosCount > 0);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle todos"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !activeTodosCount,
        })}
        onClick={handleToggle}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleQuery}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
