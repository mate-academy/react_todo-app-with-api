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
  const todoProcessingIds = (id: number) => {
    return processingIds.includes(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={todoProcessingIds(todo.id)}
          onPatch={onPatch}
        />
      ))}
    </section>
  );
};
