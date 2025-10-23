import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => Promise<boolean>;
  onUpdate: (id: number, newTitle: string) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          completed={todo.completed}
          title={todo.title}
          loading={loadingTodoIds.includes(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
