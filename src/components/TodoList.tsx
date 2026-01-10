import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/enums';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: TodosFilter;
  tempTodo: Todo | null;
  updatingIds: Set<number>;
  onDeleteTodo: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  updatingIds,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const visibleTodos = todos.filter(todo => {
    if (filter === TodosFilter.Active) {
      return !todo.completed;
    }

    if (filter === TodosFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={updatingIds.has(todo.id) || todo.id === 0}
          onDelete={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          onDelete={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
