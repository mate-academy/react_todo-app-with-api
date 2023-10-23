import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (todoId: number) => Promise<void>,
  isProcessing: boolean,
  isProcessingTodos: number[],
  editTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
  setIsProcessingTodos: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isProcessing,
  isProcessingTodos,
  editTodo,
  setIsProcessingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isProcessing={isProcessing}
          isProcessingTodos={isProcessingTodos}
          editTodo={editTodo}
          setIsProcessingTodos={setIsProcessingTodos}
        />
      ))}
    </section>
  );
};
