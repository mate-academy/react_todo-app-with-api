import { FC } from 'react';

import { TodoItem } from '..';

import { useAppContext } from '../../hooks/useAppContext';

export const TodoList: FC = () => {
  const { filteredTodo } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
