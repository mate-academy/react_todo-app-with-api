import React from 'react';
import { Form } from './Form';

type Props = {
  areAllCompleted: boolean;
  hasTodos: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  newTitle: string;
  onSubmit: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  onTitleChange: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  hasTodos,
  inputRef,
  isAdding,
  newTitle,
  onSubmit,
  onToggleAll,
  onTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <Form
        inputRef={inputRef}
        isAdding={isAdding}
        newTitle={newTitle}
        onSubmit={onSubmit}
        onTitleChange={onTitleChange}
      />
    </header>
  );
};
