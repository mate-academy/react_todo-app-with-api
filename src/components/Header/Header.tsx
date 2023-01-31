import React, { memo } from 'react';
import cn from 'classnames';

import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  title: string;
  isTodoAdding: boolean;
  isAllTodosCompleted: boolean;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAllTodos: () => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isTodoAdding,
    isAllTodosCompleted,
    setTitle,
    handleSubmitForm,
    onUpdateAllTodos,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={onUpdateAllTodos}
      />

      <NewTodoField
        title={title}
        isTodoAdding={isTodoAdding}
        onSubmitForm={handleSubmitForm}
        onInputChange={setTitle}
      />
    </header>
  );
});
