import { TodoItem } from '../TodoItem';

import type { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: TempTodo | null;
  pendingTodoIds: Set<number>;
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, completed: boolean) => void;
  onTodoUpdate: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoList = ({
  todos,
  tempTodo,
  pendingTodoIds,
  onTodoDelete,
  onTodoToggle,
  onTodoUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isPending={pendingTodoIds.has(todo.id)}
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
          onTodoUpdate={onTodoUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isPending
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
          onTodoUpdate={onTodoUpdate}
        />
      )}
    </section>
  );
};
