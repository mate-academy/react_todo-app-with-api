import { Todo } from '../types/Todo';
import { HeaderForm } from './HeaderForm';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  isAdding: boolean;
  onAddTodo: (title: string) => Promise<boolean>;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => Promise<void>;
  isTogglingAll: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  isLoading,
  isAdding,
  onAddTodo,
  newTodoInputRef,
  isTogglingAll,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          disabled={isLoading || isTogglingAll}
          onClick={onToggleAll}
        />
      )}

      <HeaderForm
        onAddTodo={onAddTodo}
        newTodoInputRef={newTodoInputRef}
        isAdding={isAdding}
      />
    </header>
  );
};
