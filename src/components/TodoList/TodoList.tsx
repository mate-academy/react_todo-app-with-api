import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[];
  onStatusChanged: (id: number, status: boolean) => void;
  updateTodo: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
  onStatusChanged,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onStatusChanged={() => onStatusChanged(todo.id, !todo.completed)}
          updateTodo={updateTodo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onDelete={onDelete}
          onStatusChanged={() => null}
          updateTodo={updateTodo}
        />
      )}

    </section>
  );
};
