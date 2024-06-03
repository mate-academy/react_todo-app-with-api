import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onTodoDeleteButton: (todoId: number) => void;
  loadingTodoIds: number[];
  onTodoStatus: (todoId: number, completed: boolean) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleError: (errorMessage: ErrorTypes) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onTodoDeleteButton,
  loadingTodoIds,
  tempTodo,
  onTodoStatus,
  setLoadingTodoIds,
  setTodos,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          onTodoDeleteButton={onTodoDeleteButton}
          key={todo.id}
          onTodoStatus={onTodoStatus}
          setLoadingTodoIds={setLoadingTodoIds}
          loadingTodoIds={loadingTodoIds}
          setTodos={setTodos}
          handleError={handleError}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onTodoDeleteButton={onTodoDeleteButton}
          key={tempTodo.id}
          onTodoStatus={onTodoStatus}
          setLoadingTodoIds={setLoadingTodoIds}
          loadingTodoIds={loadingTodoIds}
          setTodos={setTodos}
          handleError={handleError}
        />
      )}
    </section>
  );
};
