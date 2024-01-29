import { useContext, useMemo } from 'react';

import { TodoItem } from '../TodoItem';

import { Context } from '../../Context';
import { Filter } from '../../types/Filter';

export const Main = () => {
  const { todos, filter } = useContext(Context);

  const filteredTodos = useMemo(() => {
    if (filter === Filter.ACTIVE) {
      return todos.filter((item) => !item.completed);
    }

    if (filter === Filter.COMPLETED) {
      return todos.filter((item) => item.completed);
    }

    return todos;
  }, [filter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
