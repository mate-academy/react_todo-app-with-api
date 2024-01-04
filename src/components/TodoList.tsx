import { useEffect } from 'react';
import { useTodoContext } from '../context';
import { TodoInfo } from './TodoInfo';
import { TodoFooter } from './TodoFooter';

export const TodoList = () => {
  const {
    visibleTodos,
    setVisibleTodos,
    allTodos,
    tempTodo,
  } = useTodoContext();

  useEffect(() => {
    setVisibleTodos(allTodos);
  }, [allTodos, setVisibleTodos]);

  return (
    <>
      {visibleTodos?.map(todo => (
        <TodoInfo todo={todo} />
      ))}
      {tempTodo
        && (
          <TodoInfo todo={tempTodo} />
        )}
      {allTodos && allTodos.length > 0
        && (
          <TodoFooter />
        )}
    </>
  );
};
