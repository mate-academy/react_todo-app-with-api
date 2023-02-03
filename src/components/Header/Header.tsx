import React, { memo } from 'react';
import cn from 'classnames';
import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  title: string,
  isAdding: boolean,
  isAllTodosCompleted: boolean,
  changeInput: React.Dispatch<React.SetStateAction<string>>,
  submitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  updateAllTodos: () => void,
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isAdding,
    isAllTodosCompleted,
    changeInput,
    submitForm,
    updateAllTodos,
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
        onClick={updateAllTodos}
      />

      <NewTodoField
        title={title}
        className="todoapp__new-todo"
        isAdding={isAdding}
        submitForm={submitForm}
        changeInput={changeInput}
      />
    </header>
  );
});
