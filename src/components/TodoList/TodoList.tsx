import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  loading: number[];
  temporaryTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorMessage: (error: string) => void;
  setLoading: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  temporaryTodo,
  handleDeleteTodo,
  setTodos,
  setErrorMessage,
  setLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          handleDeleteTodo={handleDeleteTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          loading={loading}
          handleDeleteTodo={handleDeleteTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
        />
      )}
    </section>
  );
};
