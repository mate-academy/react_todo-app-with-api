import { ErrorMessage, PatchTodo, Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  isTempTodoLoading: boolean;
  editedTodo: PatchTodo | null;
  handleDelete: (todoId: number) => void;
  handleEditTodo: (todo: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleError: (err: ErrorMessage) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  tempTodo,
  isLoading,
  isTempTodoLoading,
  editedTodo,
  handleDelete,
  handleEditTodo,
  setTodos,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos
        .map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            handleDelete={handleDelete}
            handleEditTodo={handleEditTodo}
            editedTodo={editedTodo}
            setTodos={setTodos}
            handleError={handleError}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isTempTodoLoading}
          handleDelete={handleDelete}
          handleEditTodo={handleEditTodo}
          editedTodo={editedTodo}
          setTodos={setTodos}
          handleError={handleError}
        />
      )}
    </section>
  );
};
