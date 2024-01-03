import { FC } from 'react';
import { SingleTodo } from './SingleTodo';
import { useAppContext } from '../context/AppContext';

export const TodoList: FC = () => {
  const { visibleTodos, tempTodo } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        visibleTodos.map(todo => (
          <SingleTodo key={todo.id} todo={todo} />
        ))
      }
      {
        tempTodo && (
          <SingleTodo key={tempTodo.id} todo={tempTodo} />
        )
      }
    </section>
  );
};
