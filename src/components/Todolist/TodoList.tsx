import { useTodoContext } from '../../context/TodoContext';
import { Statuses } from '../../types/Common';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, status, tempTodo } = useTodoContext();

  const visibleTodos = todos.filter((todo) => {
    switch (status) {
      case Statuses.ACTIVE:
        return !todo.completed;

      case Statuses.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isPermanentlyLoading />}
    </section>
  );
};
