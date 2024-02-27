import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../Types/Todo';
import { StateContext } from './TodosContext';

export const Main: React.FC = () => {
  const { todos, filterBy } = useContext(StateContext);

  function filterTodos() {
    switch (filterBy) {
      case 'All':
        return todos;

      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }

  const filteredTodos = filterTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
