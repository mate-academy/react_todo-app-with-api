import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  processingIds: number[],
  onToggle: (todoId: number) => void,
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  isSubmitted: boolean,
  areSubmiting: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
  onToggle,
  togglingId,
  onUpdate,
  areSubmiting,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        processingIds={processingIds}
        onToggle={onToggle}
        togglingId={togglingId}
        onUpdate={onUpdate}
        areSubmiting={areSubmiting}
      />
    ))}
  </section>
);
