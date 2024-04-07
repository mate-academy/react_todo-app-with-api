import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  preparedTodos: Todo[];
  loadingTodosIds: number[];
  tempTodo: null | Todo;
  deleteTodo: (id: number) => Promise<void>;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  setLoadingTodosIds: (todos: number[]) => void;
}

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  loadingTodosIds,
  tempTodo,
  deleteTodo,
  updtTodo,
  setLoadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {preparedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodosIds={loadingTodosIds}
          updtTodo={updtTodo}
          setLoadingTodosIds={setLoadingTodosIds}
        />
      ))}

      {tempTodo && (
        <>
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            loadingTodosIds={loadingTodosIds}
            deleteTodo={deleteTodo}
            updtTodo={updtTodo}
            setLoadingTodosIds={setLoadingTodosIds}
          />
        </>
      )}
    </section>
  );
};
