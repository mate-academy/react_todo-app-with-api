import cn from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  hasTodos: boolean;
  hasActiveTodos: boolean;
  handleAddTodo: (
    newTitle: string,
    setNewTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  titleField: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const Header: React.FC<Props> = ({
  hasTodos,
  hasActiveTodos,
  handleAddTodo,
  titleField,
  onToggleAll,
}) => {
  const [newTitle, setNewTitle] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await handleAddTodo(newTitle, setNewTitle);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !hasActiveTodos })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
