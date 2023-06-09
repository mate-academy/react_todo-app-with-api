import { Todo } from './types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  temporaryTodo: Todo | null;
  isLoading: boolean,
  updatingTodoIds: number[],
  handleStatusChange: (id: number) => Promise<void>,
  handleTitleChange: (id: number, title: string) => Promise<void>,
}

export const TodoList: React.FC<TodoListProps> = (
  {
    todos,
    onDelete,
    temporaryTodo,
    isLoading,
    updatingTodoIds,
    handleStatusChange,
    handleTitleChange,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          isLoading={isLoading}
          updatingTodoIds={updatingTodoIds}
          handleStatusChange={handleStatusChange}
          handleTitleChange={handleTitleChange}
        />
      ))}
      {temporaryTodo
        && (
          <TodoItem
            key={0}
            todo={temporaryTodo}
            onDelete={() => { }}
            isLoading={isLoading}
            updatingTodoIds={[0]}
            handleStatusChange={handleStatusChange}
            handleTitleChange={handleTitleChange}
          />
        )}
    </section>
  );
};
