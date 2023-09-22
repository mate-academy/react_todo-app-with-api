import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isLoadingTodoIds: number[],
  handleToggleCompleted: (todo: Todo) => Promise<void>,
  handleDeleteTodo: (id: number) => Promise<void>,
  handleUpdateTodo: (todo: Todo) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoadingTodoIds,
  handleToggleCompleted,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoadingTodoIds={isLoadingTodoIds}
          handleToggleCompleted={handleToggleCompleted}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          handleUpdateTodo={handleUpdateTodo}
          isLoadingTodoIds={isLoadingTodoIds}
          handleToggleCompleted={handleToggleCompleted}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}

    </section>
  );
};
