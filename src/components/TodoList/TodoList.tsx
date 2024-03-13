import { useMemo } from 'react';
import { useTodos } from '../../Store';
import { getFilteredTodos } from '../../services/getFilteredTodos';
import { TodoItem } from '../TodoItem';

export const Todolist = () => {
  const { todos, filterStatus } = useTodos();

  const memoizedTodos = useMemo(() => todos, [todos]);
  const memoizedFilterStatus = useMemo(() => filterStatus, [filterStatus]);

  const filteredTodos = useMemo(() =>
    getFilteredTodos(memoizedTodos, memoizedFilterStatus),
    [memoizedTodos, memoizedFilterStatus]
  );

  return (
    <div className="todo-list" data-cy="todosList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
