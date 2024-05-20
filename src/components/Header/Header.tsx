import { FC } from 'react';

import { Form } from '..';

import { useHeaderLogic } from '../../hooks';

export const Header: FC = () => {
  const { todos, allCompleted, onToggleAllClick } = useHeaderLogic();

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all  ${allCompleted && todos.length > 0 ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAllClick}
        />
      )}
      <Form />
    </header>
  );
};
