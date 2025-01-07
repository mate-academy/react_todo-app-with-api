import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { FilteredTodos } from '../utils/FilteredTodos';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  selectedFilter: Status;
  isSubmitting: boolean;
  setIsSubmitting: (bol: boolean) => void;
  tempTodo: Todo | null;
  loadingTodos: number[];
  onDelete: (postId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  setError: (error: string) => void;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedFilter,
  isSubmitting,
  tempTodo,
  loadingTodos,
  onDelete,
  onUpdate,
  setError,
}) => {
  const filteredTodos = FilteredTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isSubmitting={isSubmitting}
          isLoading={loadingTodos.includes(todo.id)}
          setError={setError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          isLoading={loadingTodos.includes(0)}
          setError={setError}
        />
      )}
    </section>
  );
};
