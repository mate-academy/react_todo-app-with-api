/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo?: Todo | null;
  loading?: boolean;
  onDelete: (todoId: number) => void;
  todosToDelete?: Set<number>;
  onStatusChange: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loading,
  onDelete,
  todosToDelete,
  onStatusChange,
  onUpdate,
}) => {
  const displayTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {displayTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={
            loading && (todo.id === tempTodo?.id || todosToDelete?.has(todo.id))
          }
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
