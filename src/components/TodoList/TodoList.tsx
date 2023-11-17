import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  processingIds: number[],
  onToggle: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  isSubmitted: boolean,
  isSubmiting: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
  onToggle,
  togglingId,
  onUpdate,
  isSubmiting,
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
        isSubmiting={isSubmiting}
      />
    ))}
  </section>
);
