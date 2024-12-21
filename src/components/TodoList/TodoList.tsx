import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (value: number) => Promise<void>;
  loading: number[];
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  loading,
  onUpdateTodo,
}) => {
  return (
    <div className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isLoading={loading.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </div>
  );
};
