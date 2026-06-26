import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  isLoading: boolean;
  deletingId: number | null;
  updatingIds: number[];
  onToggle: (id: number) => void;
  handleUpdate: (todo: Todo) => Promise<void> | void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoading,
  deletingId,
  updatingIds,
  onToggle,
  handleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={todo.id === deletingId || updatingIds.includes(todo.id)}
          isProcessed
          handleUpdate={handleUpdate}
          onToggle={onToggle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
          isProcessed
          handleUpdate={handleUpdate}
          onToggle={onToggle}
        />
      )}
    </section>
  );
};
