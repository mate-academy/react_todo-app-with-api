import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: Set<number>;
  onStatusChange: (id: number, status: boolean) => void;
  updateTodo: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
  onStatusChange,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingIds.has(todo.id)}
          onDelete={onDelete}
          onStatusChange={() => onStatusChange(todo.id, !todo.completed)}
          updateTodo={updateTodo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onDelete={onDelete}
          onStatusChange={() => { }}
          updateTodo={updateTodo}
        />
      )}

    </section>
  );
};
