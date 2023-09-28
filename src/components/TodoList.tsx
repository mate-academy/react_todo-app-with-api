import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { PrevTodos, PrevProcessingTodoIds } from '../types/PrevState';

type Props = {
  filteredTodos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  processingTodoIds: number[];
  handleToggleTodo: (todo: Todo) => void;
  tempTodo: Todo | null;
  setTodos: (todos: Todo[] | PrevTodos) => void;
  setErrorMessage: (error: string) => void;
  setProcessingTodoIds: (
    todoIds: number[] | PrevProcessingTodoIds
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  handleDeleteTodo,
  handleToggleTodo,
  processingTodoIds,
  tempTodo,
  setTodos,
  setErrorMessage,
  setProcessingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={handleDeleteTodo}
          isProcessing={processingTodoIds.includes(todo.id)}
          onToggleTodo={handleToggleTodo}
          onTodosChange={setTodos}
          onErrorMessageChange={setErrorMessage}
          onProcessingTodoIdsChange={setProcessingTodoIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessing
        />
      )}
    </section>
  );
};
