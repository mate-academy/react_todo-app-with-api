import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onSetErrorMessage: (message: ErrorMessage | null) => void;
  isSubmitting: boolean;
  onUpdate: (todo: Todo) => void;
}

export const TodoList = ({
  todos,
  onDelete,
  tempTodo,
  onSetErrorMessage,
  isSubmitting,
  onUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onSetErrorMessage={onSetErrorMessage}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          onSetErrorMessage={onSetErrorMessage}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
