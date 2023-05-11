import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isDeletingCompleted: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isDeletingCompleted,
}) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isPerentLoading={
            (isDeletingCompleted && todo.completed)
          }
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          isPerentLoading={tempTodo !== null}
        />
      )}
    </>
  );
};
