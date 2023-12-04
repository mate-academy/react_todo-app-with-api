import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  loadingIds,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todo={todo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
        />
      )}

    </section>
  );
};
