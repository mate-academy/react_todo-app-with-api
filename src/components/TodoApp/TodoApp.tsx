import { useTodosProvider } from '../../providers/TodosContext';
import { Error } from '../Errors/ErrorMessage';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { TodoList } from '../TodoList/TodoList';

export const TodoApp: React.FC = () => {
  const { isLoading, todos } = useTodosProvider();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList />

        {!isLoading && todos.length > 0
        && (
          <Footer />
        ) }
      </div>

      <Error />

    </div>
  );
};
