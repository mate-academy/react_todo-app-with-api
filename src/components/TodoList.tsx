import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoId: number[];
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoId={loadingTodoId}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
    </section>
  );
};
