import { Todo } from '../types/Todo';
import { TodoListItem } from './TodoListItem';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  deletingIds: number[],
  onToggle: (todoId: number) => void,
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  isSubmiting: boolean,
  areSubmiting: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  onToggle,
  togglingId,
  onUpdate,
  areSubmiting,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingIds={deletingIds}
          onToggle={onToggle}
          togglingId={togglingId}
          onUpdate={onUpdate}
          areSubmiting={areSubmiting}
        />
      ))}
    </section>
  );
};
