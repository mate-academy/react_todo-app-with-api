import { useContext } from 'react';
import { AppContext, AppContextType } from '../Contexts/AppContextProvider';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { visibleTodos, tempTodo } = useContext(AppContext) as AppContextType;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} tempIsLoading />}
    </section>
  );
};
