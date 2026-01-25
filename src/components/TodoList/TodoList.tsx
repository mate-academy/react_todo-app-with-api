import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: (Todo & { isDeleting?: boolean; isUpdating?: boolean })[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onRename: (id: number, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id || `temp-${todo.title}`}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
    </section>
  );
};
