import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => void;
  onToggleStatus: (todo: Todo) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  tempTodo,
  processingIds,
  onDelete,
  onToggleStatus,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={processingIds.includes(todo.id)}
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          isLoading
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
