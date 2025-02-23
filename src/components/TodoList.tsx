import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingIds: number[];
  handleDelete: (id: number) => void;
  handleToggleStatus: (todo: Todo) => void;
  handleRename: (todo: Todo) => void;
  tempState: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  loadingIds,
  handleDelete,
  handleToggleStatus,
  handleRename,
  tempState,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            loadingIds={loadingIds}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onRename={handleRename}
            key={todo.id}
          />
        );
      })}
      {tempState && <TodoItem todo={tempState} loadingIds={[0]} />}
    </section>
  );
};
