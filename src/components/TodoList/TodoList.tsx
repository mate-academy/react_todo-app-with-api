import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (id: number) => void;
  processingIds: number[];
  onPatch: (id: number, data: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  processingIds,
  onPatch,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const isProcessing = processingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isLoading={isProcessing}
            onPatch={onPatch}
          />
        );
      })}
    </section>
  );
};
