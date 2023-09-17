import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void,
  loadingIds: number[],
  setTodos: (v: Todo[]) => void,
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
          todo={todo}
          todos={todos}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setLoadingIds={setLoadingIds}
        />
      ))}
    </section>
  );
};
