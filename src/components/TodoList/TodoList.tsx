import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  setTodos,
  setError,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setError={setError}
          setLoadingIds={setLoadingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
