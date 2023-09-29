import { memo } from 'react';

import { ErrorMessage } from '../types';
import { ToggleAllButton } from './ToggleAllButton';
import { NewTodo } from './NewTodo';

type Props = {
  hasTodos: boolean;
  allCompleted: boolean;
  totalCount: number;
  onAdd: (title: string) => Promise<void>;
  onError: (message: ErrorMessage) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = memo(({
  hasTodos,
  allCompleted,
  totalCount,
  onAdd,
  onError,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <ToggleAllButton
        active={allCompleted}
        onToggleAll={onToggleAll}
      />
    )}

    <NewTodo
      refocus={totalCount}
      onAdd={onAdd}
      onError={onError}
    />
  </header>
));
