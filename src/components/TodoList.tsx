import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  deletingTodoIds: number[];
  onDelete: (todoId: number) => void;
  updatingTodoIds: number[];
  onStatusToggle: (todo: Todo) => void;
  onTitleUpdate: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  deletingTodoIds,
  onDelete,
  updatingTodoIds,
  onStatusToggle,
  onTitleUpdate,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const isLoading =
          deletingTodoIds.includes(todo.id) ||
          updatingTodoIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            onDelete={onDelete}
            onStatusToggle={onStatusToggle}
            onTitleUpdate={onTitleUpdate}
          />
        );
      })}
    </section>
  );
};
