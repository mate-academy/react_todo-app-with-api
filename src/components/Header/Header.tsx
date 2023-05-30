import classNames from 'classnames';
import React from 'react';

type Props = {
  hasSomeTodos: boolean,
  onAddTodo: (event: React.FormEvent) => void,
  newTodoTitle: string,
  onChangeNewTodoTitle: (title: string) => void,
  isPending: boolean,
  allChecked: boolean,
  onToggleAll: (active: boolean) => void,
};

export const Header: React.FC<Props> = ({
  hasSomeTodos,
  onAddTodo,
  newTodoTitle,
  onChangeNewTodoTitle,
  isPending,
  allChecked,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasSomeTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allChecked },
          )}
          onClick={
            (e) => {
              e.currentTarget.classList.toggle('active');
              onToggleAll(e.currentTarget.classList.contains('active'));
            }
          }
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => onChangeNewTodoTitle(e.target.value)}
          disabled={isPending}
        />
      </form>
    </header>
  );
};
