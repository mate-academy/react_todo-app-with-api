import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  leftTodosLength: number;
  newTodoTitle: string;
  removeTodo: (id: number) => Promise<void>;
  patchTodo: (todo: Todo, newTitle?: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  isDeleting,
  isUpdating,
  leftTodosLength,
  newTodoTitle,
  removeTodo,
  patchTodo,
}) => {
  const temporaryTodo = {
    userId: -1,
    id: 0,
    title: newTodoTitle,
    completed: false,
  };

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

      {isAdding && (
        <TodoItem
          todo={temporaryTodo}
          key={0}
          isAdding={isAdding}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          leftTodosLength={leftTodosLength}
          removeTodo={removeTodo}
          patchTodo={patchTodo}
        />
      )}
    </section>
  );
};
