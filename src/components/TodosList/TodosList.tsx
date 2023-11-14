import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todos: Todo[];
  loadingIds: number[];
};

export const TodosList: React.FC<Props> = ({
  todos,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingIds={loadingIds}
        />
      ))}
      <TodoLoader />
    </section>
  );
};
