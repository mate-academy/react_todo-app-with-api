import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<boolean>;
  tempTodo?: Todo | null;
  isLoading: boolean;
  onUpdate: (todo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoading,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          isTempTodoDeleting={isLoading}
        />
      )}
    </section>
  );
};
