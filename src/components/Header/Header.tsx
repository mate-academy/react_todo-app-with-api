import React from 'react';
import cn from 'classnames';

import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  title: string;
  isAdding: boolean;
  isAllTodosCompleted: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAll: () => void;
};

export const Header: React.FC<Props> = (props) => {
  const {
    title,
    isAdding,
    isAllTodosCompleted,
    onChange,
    onSubmitForm,
    onUpdateAll,
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
        onClick={() => onUpdateAll()}
      />

      <NewTodoField
        title={title}
        isAdding={isAdding}
        onSubmit={onSubmitForm}
        onChange={onChange}
      />
    </header>
  );
};
