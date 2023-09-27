import { Task } from './Task';
import { useTodo } from '../../context/TodoContext';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

const filterTodosByType = (todos: Todo[], filterType: FilterType) => {
  if (filterType === 'active') {
    return todos.filter(todo => !todo.completed);
  }

  if (filterType === 'completed') {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const TodoList = () => {
  const {
    todos,
    filterTodos,
    temptTodos,
  } = useTodo();

  const visibleTodos = filterTodosByType(todos, filterTodos);

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {visibleTodos.map(todo => (
        <Task key={todo.id} todo={todo} />
      ))}
      {temptTodos.length > 0
      && temptTodos.map(todo => (
        <Task key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
