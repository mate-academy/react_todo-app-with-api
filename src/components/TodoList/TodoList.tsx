import { Todo, TodoChanges } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  tempTodo: Todo | null;
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  processingIds: number[];
  onUpdate?: (id: number, changes: TodoChanges) => Promise<void>;
};

export const TodoList: React.FC<TodoListProps> = ({
  onDelete,
  processingIds,
  tempTodo,
  todos,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && <TodoItem isLoading todo={tempTodo} />}
    </section>
  );
};
