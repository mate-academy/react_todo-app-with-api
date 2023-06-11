import { TodoAppHeader } from './TodoAppComponent/TodoAppHeader/TodoAppHeader';
import { TodoList } from './TodoAppComponent/TodoAppMain/TodoList';
import { useTodosContext } from '../Context/TodosContext';
import { TodoAppFooter } from './TodoAppComponent/TodoAppFooter/TodoAppFooter';

export const TodoApp = () => {
  const { todos } = useTodosContext();
  const isFooter = todos.length > 0;

  return (
    <div className="todoapp__content">
      <TodoAppHeader />

      <TodoList />

      {isFooter && (
        <TodoAppFooter />
      )}
    </div>
  );
};
