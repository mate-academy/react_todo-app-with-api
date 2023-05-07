import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  updateTodo: (updatedTodo: Todo) => void,
  removeLoadingTodo: (todoId: number) => void,
  addLoadingTodo: (todoId: number) => void,
  loadingTodos: number[],
  deletingTodoId: number | null,
  isLoading: boolean,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  updateTodo,
  removeLoadingTodo,
  addLoadingTodo,
  loadingTodos,
  deletingTodoId,
  isLoading,
  updateTodoOnServer,
}) => (
  <div>
    {todos.map((todo: Todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => onDelete(todo.id)}
        updateTodo={updateTodo}
        removeLoadingTodo={removeLoadingTodo}
        addLoadingTodo={addLoadingTodo}
        loadingTodos={loadingTodos}
        deletingTodoId={deletingTodoId}
        isLoading={isLoading}
        updateTodoOnServer={updateTodoOnServer}
      />
    ))}
  </div>
);
