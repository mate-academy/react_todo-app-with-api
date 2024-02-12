import { useContext } from 'react';
import { Footer } from '../Footer/Footer';
import { TodosList } from '../TodosList/TodosList';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { TodosContext } from '../../contexts/TodosContext';
import { filterTodos } from '../../services/filterTodosList';
import { Header } from '../Header/Header';

export const TodoApp = () => {
  const {
    todos, filterBy, tempTodo,
  } = useContext(TodosContext);
  const preparedTodosList = filterTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {(!!todos.length || !!tempTodo)
          && <TodosList todos={preparedTodosList} />}

        {!!todos.length
          && <Footer />}
      </div>

      <ErrorComponent />
    </div>
  );
};
