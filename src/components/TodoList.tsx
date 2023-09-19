import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  loadingIds: number[],
  setTodos: (value: Todo[]) => void,
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingIds,
  setTodos,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          loadingIds={loadingIds}
          setTodos={setTodos}
          onDeleteTodo={onDeleteTodo}
          setLoadingIds={setLoadingIds}
        />
      ))}
    </section>
  );
};
