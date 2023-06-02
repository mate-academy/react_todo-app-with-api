import React from 'react';
import cn from 'classnames';

type Props = {
  countActiveTodo: number,
  onHandleInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  inputValue: string,
  onHandleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  disabled: boolean,
  onChangeStatusAllTodo: () => Promise<void>
};

export const Header: React.FC<Props> = ({
  countActiveTodo,
  onHandleInput,
  inputValue,
  onHandleAddTodo,
  disabled: disabeled,
  onChangeStatusAllTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="button"
        className={
          cn(
            'todoapp__toggle-all',
            { active: countActiveTodo > 0 },
          )
        }
        onClick={onChangeStatusAllTodo}
      />

      <form onSubmit={onHandleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={onHandleInput}
          disabled={disabeled}
        />
      </form>
    </header>
  );
};
