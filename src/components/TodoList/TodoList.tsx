import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  loadingTodoIds: number[],
  removeTodo: (id: number) => void,
  updateTodo: (changedTodo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  removeTodo,
  updateTodo,
}) => {
  const isLoading = (todoId: number) => loadingTodoIds.includes(todoId);

  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading(todo.id)}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ))}
    </ul>
  );
};
