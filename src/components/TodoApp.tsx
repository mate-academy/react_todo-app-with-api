import { TodoAppHeader } from './TodoAppComponent/TodoAppHeader/TodoAppHeader';
import { TodoList } from './TodoAppComponent/TodoAppMain/TodoList';
import { useTodosContext } from '../Context/TodosContext';
import { TodoAppFooter } from './TodoAppComponent/TodoAppFooter/TodoAppFooter';

export const TodoApp = () => {
  const { todos } = useTodosContext();
  // const [filtered, setFiltered] = useState<Filters>(Filters.All);
  // const filteredTodos = useMemo(() => {
  //   let newTodos = todos;

  //   switch (filtered) {
  //     case 'Active':
  //       newTodos = newTodos.filter(todo => !todo.completed);
  //       break;
  //     case 'Completed':
  //       newTodos = newTodos.filter(todo => todo.completed);
  //       break;
  //     case 'All':
  //       newTodos = todos;
  //       break;
  //     default: throw new Error('wrong filters');
  //   }

  //   return newTodos;
  // }, [todos]);

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
