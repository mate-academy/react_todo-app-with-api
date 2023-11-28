import { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { TodoContext } from './TodoContext';
import { Filter } from '../types/Filter';

export const TodoList: React.FC = () => {
  const {
    todos,
    tempTodo,
    filter,
    todoWithLoader,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ALL:
      default:
        return todos;
    }
  }, [filter, todos]);

  return (
    <ul className="todoapp__main" data-cy="TodoList">

      {filteredTodos.map(todo => (
        <li>
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={todoWithLoader.includes(todo.id)}
          />
        </li>
      ))}

      {tempTodo && (
        <li>
          <TodoItem
            todo={tempTodo}
            isLoading={todoWithLoader.includes(tempTodo.id)}
          />
        </li>
      )}

    </ul>
  );
};
