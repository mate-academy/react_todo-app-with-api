import { Todo } from '../types/Todo';
import { TodoItem } from './Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          deleteTodo={deleteTodo}
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          loader={!!tempTodo}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
