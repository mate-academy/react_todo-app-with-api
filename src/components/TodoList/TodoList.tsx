import { Todo } from '../../types/Todo';
import { GlobalLoader } from '../../types/GlobalLoader';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  globalLoader: GlobalLoader,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  globalLoader,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loader={globalLoader}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} loader={GlobalLoader.All} />}
    </section>
  );
};
