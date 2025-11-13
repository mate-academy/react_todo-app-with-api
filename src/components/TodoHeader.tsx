import { TodoCreateForm } from './TodoCreateForm';
import cn from 'classnames';

type Props = {
  onToggleAll: () => void;
  allTodosCompleted: boolean;
  onAddTodo: (newTodoTitle: string, resetTitle: () => void) => void;
  onError: (error: string) => void;
  todoTitleInputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  onToggleAll,
  allTodosCompleted,
  onAddTodo,
  onError,
  todoTitleInputRef,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <TodoCreateForm
        ref={todoTitleInputRef}
        onSubmit={onAddTodo}
        onError={onError}
      />
    </header>
  );
};
