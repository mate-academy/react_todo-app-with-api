import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  currentTodo: Todo | null;
  loadingIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onChange: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, title: string) => Promise<boolean>;
};
export const TodoList: React.FC<Props> = ({
  todos,
  currentTodo = null,
  loadingIds,
  onDelete,
  onChange,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onChange={onChange}
          onUpdate={onUpdate}
        />
      ))}
      {currentTodo && <TodoItem todo={currentTodo} isLoading={true} />}
    </section>
  );
};
