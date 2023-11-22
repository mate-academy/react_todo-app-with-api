import { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { TodoContext } from './TodoContext';
import { Status } from '../types/Status';

export const TodoList: React.FC = () => {
  const {
    todos, tempTodo, filter, todoIdsWithLoader,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      case Status.All:
      default:
        return todos;
    }
  }, [filter, todos]);

  return (
    <ul className="todoapp__main" data-cy="TodoList">

      {filteredTodos.map(todo => (
        <li>
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={todoIdsWithLoader.includes(todo.id)}
          />
        </li>
      ))}

      { tempTodo && (
        <li>
          <TodoItem
            todo={tempTodo}
            key={tempTodo.id}
            isLoading={todoIdsWithLoader.includes(tempTodo.id)}
          />
        </li>
      )}

    </ul>
  );
};
