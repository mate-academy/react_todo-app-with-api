import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (
    todoId: number,
    modifiedTodo: Omit<Todo, 'id'>,
  ) => Promise<void>;
  processingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  temporaryTodo,
  onDeleteTodo,
  onUpdateTodo,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={processingTodoIds.includes(todo.id)}
        />
      ))}

      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          onDeleteTodo={() => {}}
          onUpdateTodo={onUpdateTodo}
          isLoading
        />
      )}
    </section>
  );
};
