import { SelectedStatus, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  status: SelectedStatus;
  onChangeTodo: (newTodo: Todo) => void;
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  onErrorMessage: (error: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  status,
  onChangeTodo,
  tempTodo,
  onDeleteTodo,
  onErrorMessage,
}) => {
  let filteredTodos: Todo[] = [];

  switch (status) {
    case SelectedStatus.all:
      filteredTodos = todos;
      break;
    case SelectedStatus.active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case SelectedStatus.completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    default:
      return;
  }

  if (!filteredTodos.length) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChangeTodo={onChangeTodo}
          onDeleteTodo={onDeleteTodo}
          onErrorMessage={onErrorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onChangeTodo={onChangeTodo}
          onDeleteTodo={onDeleteTodo}
          onErrorMessage={onErrorMessage}
        />
      )}
    </section>
  );
};
