import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void;
  tempTodo: null | Todo;
  processingIds?: number[] | null;
  onToggle?: (todo: Todo) => void;
  onRename: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  onToggle = () => {},
  onRename,
  tempTodo,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          processingIds={processingIds}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} onRename={onRename} />}
    </section>
  );
};
