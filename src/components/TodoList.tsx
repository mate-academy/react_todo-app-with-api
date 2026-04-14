import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => void;
  tempTodo: Todo | null;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  onUpdate,
  tempTodo,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loadingTodoId={loadingTodoIds.find(id => id === todo.id)}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loadingTodoId={tempTodo.id}
        />
      )}
    </section>
  );
};
