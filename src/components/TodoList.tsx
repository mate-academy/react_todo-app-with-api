import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  handleDeleteTodo: (id: number) => void;
  loadingTodos: number[];
  tempTodo: Todo | null;
  onToggle = () => {};
  handleUpdateTodo = () => {};
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  loadingTodos,
  tempTodo,
  onToggle,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
          onToggle={onToggle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          handleDeleteTodo={() => {}}
          onToggle={onToggle}
        />
      )}
    </section>
  );
};
