import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<boolean>;
  onRename: (id: number, title: string) => Promise<boolean>;
  processingIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  handleDelete,
  onRename,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={handleDelete}
          onRename={onRename}
          isLoading={processingIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onToggle={() => {}}
          onDelete={async () => false}
          onRename={async () => false}
          isLoading
        />
      )}
    </section>
  );
};
