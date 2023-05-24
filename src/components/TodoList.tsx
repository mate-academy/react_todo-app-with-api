import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { useTodoContext } from '../contexts/TodoContext';
import { Sorting } from '../types/Sorting';

export const TodoList: React.FC = () => {
  const {
    todos,
    filter,
    tempTodo,
  } = useTodoContext();

  const sortedTodos = todos.filter((todo) => {
    switch (filter) {
      case Sorting.Completed:
        return todo.completed;
      case Sorting.Active:
        return !todo.completed;
      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main">
      {sortedTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isCreating />
      )}
    </section>
  );
};
