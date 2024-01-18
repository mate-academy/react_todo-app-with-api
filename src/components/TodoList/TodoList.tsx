import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[],
  updateTodoItem: (todoId: number, updatedTitle: string) => void,
  deleteTodo: (todoId: number) => void,
  toggleTodoCompleted: (todoId: number) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  updateTodoItem,
  deleteTodo,
  toggleTodoCompleted,
}) => {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateTodoItem={updateTodoItem}
          deleteTodo={deleteTodo}
          toggleTodoCompleted={toggleTodoCompleted}
        />
      ))}
    </>
  );
};
