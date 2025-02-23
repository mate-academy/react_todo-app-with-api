import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete?: (todoId: number) => void;
  loadingTodos: number[];
  onToggle?: (todo: Todo) => void;
  onRename?: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodos,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodos.includes(todo.id)}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={loadingTodos.includes(0)} />
      )}
    </section>
  );
};
