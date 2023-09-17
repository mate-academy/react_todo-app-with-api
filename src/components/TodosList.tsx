import { Todo } from '../types/TodoItem';
import TodoItem from './Todo';

interface Props {
  visibleTodos: Todo[];
  handleDeleteTodo: (ids: number[]) => void;
  handleUpdateTodo: (ids: number[], value: Partial<Todo>) => void;
}

export default function TodosList({
  visibleTodos,
  handleDeleteTodo,
  handleUpdateTodo,
}: Props) {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          key={todo.id}
        />
      ))}
    </>
  );
}
