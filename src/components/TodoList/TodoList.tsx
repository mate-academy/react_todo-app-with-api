import { TodoItem } from '../Todo/TodoItem';
import { useTodosContext } from '../../utils/useTodosContext';
import { handleFilteredTodos } from '../../utils/handleFiltredTodos';

export const TodoList: React.FC = () => {
  const { todos, filterSelected, tempTodo, onDelete, setIsFocused } =
    useTodosContext();
  const preparedTodos = handleFilteredTodos(todos, filterSelected);

  const deleteTodo = (todoId: number) => {
    onDelete(todoId);
    setIsFocused(true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} deleteTodo={deleteTodo} />}
    </section>
  );
};
