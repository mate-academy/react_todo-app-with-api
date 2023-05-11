import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isPerentLoading: boolean;
  onSetDeleteTodoID: React.Dispatch<React.SetStateAction<number | null>>;
  deleteTodoID: number | null;
  isDeletingCompleted: boolean;
  onUpdateTodoComplete: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isPerentLoading,
  onSetDeleteTodoID,
  deleteTodoID,
  isDeletingCompleted,
  onUpdateTodoComplete,
}) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onSetDeleteTodoID={onSetDeleteTodoID}
          isPerentLoading={
            todo.id === deleteTodoID
            || (isDeletingCompleted && todo.completed)
          }
          onUpdateTodoComplete={onUpdateTodoComplete}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          isPerentLoading={isPerentLoading}
        />
      )}
    </>
  );
};
