import { forwardRef } from 'react';
import cn from 'classnames';
import { AddTodoForm, AddTodoFormRef } from '../AddTodoForm';

type Props = {
  isLoading: boolean;
  isThereAlLeastOneTodo: boolean;
  onAddTodo: (todoTitle: string) => Promise<void>;
  isAlLeastOneTodoLoading: boolean;
  isAllTodosCompleted: boolean;
  onToggleTodos: () => void;
};

// eslint-disable-next-line react/display-name
export const Header = forwardRef<AddTodoFormRef, Props>(
  (
    {
      isLoading,
      isThereAlLeastOneTodo,
      onAddTodo,
      isAlLeastOneTodoLoading,
      isAllTodosCompleted,
      onToggleTodos,
    },
    ref,
  ) => {
    return (
      <header className="todoapp__header">
        {isThereAlLeastOneTodo && !isAlLeastOneTodoLoading && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleTodos}
          />
        )}

        <AddTodoForm isLoading={isLoading} onAddTodo={onAddTodo} ref={ref} />
      </header>
    );
  },
);
