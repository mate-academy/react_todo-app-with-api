import React, { memo } from 'react';
import cn from 'classnames';

import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  title: string;
  isTodoAdding: boolean;
  isAllTodosCompleted: boolean;
  onInputChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAllTodos: () => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isTodoAdding,
    isAllTodosCompleted,
    onInputChange,
    onSubmitForm,
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
        onSubmitForm={onSubmitForm}
        onInputChange={onInputChange}
      />
    </header>
  );
});
