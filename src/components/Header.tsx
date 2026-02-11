import { FormEvent, ForwardedRef, forwardRef } from 'react';
import classNames from 'classnames';

type Props = {
  onTodoTitleChange: (todoTitle: string) => void;
  todoTitle: string;
  onAddTodo: () => void;
  isAllTodosCompleted: boolean;
  onToggleAll: () => void;
  disabled?: boolean;
  hasTodos: boolean;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  function HeaderComponent(
    {
      onTodoTitleChange,
      todoTitle,
      onAddTodo,
      isAllTodosCompleted,
      onToggleAll,
      disabled = false,
      hasTodos,
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) {
    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      onAddTodo();
    }

    return (
      <header className="todoapp__header">
        {hasTodos && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}

        <form onSubmit={handleFormSubmit}>
          <input
            ref={ref}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={event => onTodoTitleChange(event.target.value)}
            disabled={disabled}
          />
        </form>
      </header>
    );
  },
);
