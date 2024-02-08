import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  completedLoading: boolean;
  toggleAllChangedLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  completedLoading,
  toggleAllChangedLoading,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo} // Используем обновленную функцию для удаления с лоадером
          updateTodo={updateTodo}
          completedLoading={completedLoading}
          toggleAllChangedLoading={toggleAllChangedLoading}
        />
      ))}
    </>
  );
};
