import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  handleDelete: (todoId: number) => void;
  handleToggle: (todo: Todo) => void;
  handleRename: (todoId: number, title: string) => Promise<void>;
};

export const TodoList = ({
  todos,
  visibleTodos,
  tempTodo,
  loadingTodoIds,
  handleDelete,
  handleToggle,
  handleRename,
}: Props) => {
  if (todos.length === 0 && !tempTodo) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onRename={handleRename}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};
