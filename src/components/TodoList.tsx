import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[];
  onUpdate: (todo: Todo, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  onDelete,
  loadingIds,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          isLoading={true}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
