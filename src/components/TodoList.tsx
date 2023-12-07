import { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedTodoId: number | null;
  completedTodosId: number[];
  isLoading: boolean;
  isClearCompleted: boolean;
  isToggleAllTodos: boolean;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  handleEditTodo: (id: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  isClearCompleted,
  isToggleAllTodos,
  selectedTodoId,
  completedTodosId,
  onToggleTodo,
  onDeleteTodo,
  handleEditTodo,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        isLoading={isLoading && (
          !todo.id
          || selectedTodoId === todo.id
          || (completedTodosId?.includes(todo.id) && isClearCompleted)
          || ((!completedTodosId?.includes(todo.id)
            || completedTodosId.length === todos.length)
            && isToggleAllTodos)
        )}
        onToggleTodo={onToggleTodo}
        handleEditTodo={handleEditTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        isLoading={isLoading}
        handleEditTodo={handleEditTodo}
        onDeleteTodo={onDeleteTodo}
        onToggleTodo={onToggleTodo}
      />
    )}
  </section>
);
