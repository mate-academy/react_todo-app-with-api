import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  updatingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  updatingIds,
  setTodos,
  setError,
  setDeletingIds,
  setUpdatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          setTodos={setTodos}
          setError={setError}
          setDeletingIds={setDeletingIds}
          setUpdatingIds={setUpdatingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
