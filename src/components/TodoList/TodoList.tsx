import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  processingIds: number[];
  onPatchTodo: (id: number, completed: boolean) => void;
  onRenameTodo: (id: number, title: string) => Promise<void>;
};

export const TodoList = ({
  todos,
  tempTodo,
  onDeleteTodo,
  processingIds,
  onPatchTodo,
  onRenameTodo,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={onDeleteTodo}
          onPatch={onPatchTodo}
          onRename={onRenameTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          onDelete={onDeleteTodo}
          onPatch={onPatchTodo}
          onRename={onRenameTodo}
        />
      )}
    </section>
  );
};
