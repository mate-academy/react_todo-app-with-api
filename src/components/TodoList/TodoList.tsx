import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  selectedTodoId: number | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, data: {}) => void;
  isLoading: boolean;
  changedTodosId: number[];
}

export const TodoList = (props: Props) => {
  const {
    todos,
    selectedTodoId,
    onDeleteTodo,
    onUpdateTodo,
    isLoading,
    changedTodosId,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={isLoading}
          changedTodosId={changedTodosId}
        />
      ))}
    </section>
  );
};
