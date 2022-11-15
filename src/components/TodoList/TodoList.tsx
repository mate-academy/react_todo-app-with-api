import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  isAdding: boolean;
  deletedTodoIDs: number[];
  deleteTodoAtServer: (id: number) => void;
  toggleTodoStatus: (id: number, completed: boolean) => Promise<void>;
  updateTodo: (id: number, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isAdding,
  deleteTodoAtServer,
  deletedTodoIDs,
  toggleTodoStatus,
  updateTodo,
}) => {
  const tempTodo = {
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isAdding={deletedTodoIDs.includes(todo.id)}
          deleteTodoAtServer={deleteTodoAtServer}
          toggleTodoStatus={toggleTodoStatus}
          updateTodo={updateTodo}
        />
      ))}
      {isAdding && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isAdding={isAdding}
          toggleTodoStatus={toggleTodoStatus}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
