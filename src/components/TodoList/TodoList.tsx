import { memo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (
    id: number,
    onSuccess?: () => void,
    onFailure?: () => void,
  ) => void;
  onUpdateTitle: (
    id: number,
    title: string,
    onSuccess?: () => void,
    onFailure?: () => void,
  ) => void;
};

export const TodoList: FC<TodoListProps> = memo(
  ({ todos, onToggle, onDelete, tempTodo, loadingIds, onUpdateTitle }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {}
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            isLoading={loadingIds.includes(todo.id)}
            isTemporary={false}
            onUpdateTitle={onUpdateTitle}
          />
        ))}
        {tempTodo && (
          <TodoItem
            key={`temp-${tempTodo.id}`}
            todo={tempTodo}
            onToggle={() => {}}
            onDelete={onDelete}
            isLoading={true}
            isTemporary={true}
            onUpdateTitle={onUpdateTitle}
          />
        )}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
