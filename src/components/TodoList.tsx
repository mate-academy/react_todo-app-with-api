import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (value: number) => void;
  tempTodo: Todo | null;
  loadedTodoIds: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  handleUpdateTodoTitle: (todoId: number, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loadedTodoIds,
  handleToggleTodo,
  handleUpdateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoading={loadedTodoIds.includes(todo.id)}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => {}}
          isLoading={true}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />
      )}
    </section>
  );
};
