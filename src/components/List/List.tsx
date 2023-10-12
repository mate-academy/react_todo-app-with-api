import { USER_ID, getTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Item/TodoItem';

type ListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
  onStatusChange: (todoId: number, completed: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  isTogglingAll: boolean;
};

export const List: React.FC<ListProps> = (
  {
    todos, tempTodo, handleDelete,
    onStatusChange, setTodos,
  },
) => {
  const reloadTodos = async () => {
    const reloadedTodos = await getTodos(USER_ID);

    setTodos(reloadedTodos);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDelete={handleDelete}
          onStatusChange={onStatusChange}
          onTodoUpdate={reloadTodos}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDelete={handleDelete}
          onStatusChange={onStatusChange}
          onTodoUpdate={reloadTodos}
        />
      )}
    </section>
  );
};
