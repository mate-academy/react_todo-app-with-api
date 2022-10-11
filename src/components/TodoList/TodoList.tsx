import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  leftTodosLength: number;
  removeTodo: (id: number) => Promise<void>;
  patchTodo: (todo: Todo, newTitle?: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  isDeleting,
  isUpdating,
  leftTodosLength,
  removeTodo,
  patchTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isAdding={isAdding}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          leftTodosLength={leftTodosLength}
          removeTodo={removeTodo}
          patchTodo={patchTodo}
        />
      ))}
    </section>
  );
};
