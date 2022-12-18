import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  currTitle: string,
  onDelete: (id: number) => void,
  onRename: (todo: Todo, newTitle: string) => Promise<void>,
  onChangeStatus: (todo: Todo) => void,
  loadingTodosIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onRename,
  onChangeStatus,
  loadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onRename={onRename}
          onChangeStatus={onChangeStatus}
          isLoading={loadingTodosIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
