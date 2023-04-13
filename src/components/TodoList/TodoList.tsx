import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  tempTodo: Todo | null;
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadingTodosIds: number[];
  onUpdateTodo: (todoId: number, property: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    tempTodo,
    todos,
    onDeleteTodo,
    loadingTodosIds,
    onUpdateTodo,
  } = props;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDeleteTodo}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
