import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  TodoDeleteButton: (todoId: number) => void;
  isLoading: number[];
  todoStatus: (todoId: number, completed: boolean) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleError: (errorMessage: ErrorTypes) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  TodoDeleteButton,
  isLoading,
  tempTodo,
  todoStatus,
  setIsLoading,
  setTodos,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          TodoDeleteButton={TodoDeleteButton}
          key={todo.id}
          todoStatus={todoStatus}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setTodos={setTodos}
          handleError={handleError}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          TodoDeleteButton={TodoDeleteButton}
          key={tempTodo.id}
          todoStatus={todoStatus}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setTodos={setTodos}
          handleError={handleError}
        />
      )}
    </section>
  );
};
