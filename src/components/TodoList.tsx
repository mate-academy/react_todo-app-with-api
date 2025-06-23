import { Todo } from '../types/Todo';
import { TodoFilters } from '../types/TodoFilters';
import { getVisibleTodos } from '../utils/getVisibleTodos';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  todoFilter: TodoFilters;
  onDeleteTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
  todosProcessing: number[];
  onUpdateTodo: (todoFromInput: Todo) => Promise<Todo>;
};

export const TodoList = ({
  todos,
  todoFilter,
  onDeleteTodo,
  tempTodo,
  todosProcessing,
  onUpdateTodo,
}: TodoListProps) => {
  const visibleTodos: Todo[] = getVisibleTodos(todos, todoFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={todosProcessing.includes(todo.id)}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
