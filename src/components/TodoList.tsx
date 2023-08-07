import { Todo } from '../types/Todo';
import { TodoListItem } from './TodoListItem';

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
        <TodoListItem
          todo={todo}
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
