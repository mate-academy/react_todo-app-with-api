import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  filteredTodos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  loadingIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  updateTodo,
  loadingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          isLoading={loadingIds.includes(todo.id)}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
