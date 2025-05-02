import React from 'react';
import { ToggleAll } from './ToggleAll';
import { NewTodoForm } from './NewTodoForm';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  activeTodosCount: number;
  onToggleAll: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (title: string) => void;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todosLength,
  activeTodosCount,
  onToggleAll,
  onSubmit,
  title,
  setTitle,
  tempTodo,
  inputRef,
}) => (
  <header className="todoapp__header">
    {todosLength > 0 && (
      <ToggleAll active={activeTodosCount === 0} onToggleAll={onToggleAll} />
    )}

    <NewTodoForm
      onSubmit={onSubmit}
      title={title}
      setTitle={setTitle}
      disabled={!!tempTodo}
      inputRef={inputRef}
    />
  </header>
);
