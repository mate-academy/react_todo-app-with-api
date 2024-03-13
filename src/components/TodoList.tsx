import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  addingTodoId: number | null;
  setAddingTodoId: (id: number | null) => void;
  handleDelete: (id: number) => void;
  handleToggle: (id: number) => void;
  handleUpdate: (updatedTodo: Todo) => void;
  setError: (error: string) => void;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  updatingTodoId: number | null;
  setUpdatingTodoId: (updatingTodoId: number | null) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  addingTodoId,
  setAddingTodoId,
  handleDelete,
  handleToggle,
  handleUpdate,
  setError,
  isUpdating,
  setIsUpdating,
  updatingTodoId,
  setUpdatingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          addingTodoId={addingTodoId}
          setAddingTodoId={setAddingTodoId}
          handleDelete={handleDelete}
          handleToggle={handleToggle}
          handleUpdate={handleUpdate}
          setError={setError}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          updatingTodoId={updatingTodoId}
          setUpdatingTodoId={setUpdatingTodoId}
        />
      ))}
    </section>
  );
};
