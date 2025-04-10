import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todoFilter: Todo[];
  handleToggle: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoTitle: (id: number, title: string) => void;
  tempTodo: Todo | null;
  loadedTodoIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todoFilter,
  handleToggle,
  handleDeleteTodo,
  handleUpdateTodoTitle,
  tempTodo,
  loadedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoFilter.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          isLoading={loadedTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key="tempTodo"
          todo={tempTodo}
          handleToggle={() => {}}
          handleDeleteTodo={() => {}}
          handleUpdateTodoTitle={() => {}}
          isLoading={true}
        />
      )}
    </section>
  );
};
