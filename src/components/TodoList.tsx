import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onUpdateTodoStatus: (
    todoId: Todo['id'],
    todo: Omit<Todo, 'id'>,
  ) => Promise<void>;
  isLoadingTodoIds: Todo['id'][];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodoStatus,
  isLoadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodoStatus={onUpdateTodoStatus}
          isLoading={isLoadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={() => {}}
          onUpdateTodoStatus={() => Promise.resolve()}
          isLoading={true}
        />
      )}
    </section>
  );
};
