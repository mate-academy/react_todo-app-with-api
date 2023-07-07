import { FC } from 'react';
import cn from 'classnames';
import { TodoForm } from '../components/TodoForm';

export interface Props {
  OnAddTodo: (title: string) => void;
  handleShowError: (error: string) => void;
  handleToggleAll: () => void;
  isActiveTodos: boolean;
}

export const Header: FC<Props> = ({
  handleShowError,
  handleToggleAll,
  isActiveTodos,
  OnAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAllCompletedTodos"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isActiveTodos,
        })}
        onClick={handleToggleAll}
      />
      <TodoForm
        onAddTodo={OnAddTodo}
        handleShowError={handleShowError}
      />
    </header>
  );
};
