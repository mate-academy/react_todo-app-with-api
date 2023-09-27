import { Task } from './Task';
import { useTodo } from '../../context/TodoContext';

export const TodoList = () => {
  const {
    todos,
    filterTodos,
    temptTodos,
  } = useTodo();

  const visibleTodos = () => {
    if (filterTodos === 'active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filterTodos === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  };

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {visibleTodos().map(todo => (
        <Task key={todo.id} todo={todo} />
      ))}
      {temptTodos.length > 0
      && temptTodos.map(todo => (
        <Task key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
