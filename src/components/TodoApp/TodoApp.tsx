import { useContext } from 'react';
import { Footer } from '../Footer/Footer';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { Header } from '../Header/Header';
import { TodosContext } from '../../contexts/TodoContext';
import { filterTodos } from '../../services/filterTodosList';
import { TodosList } from '../TodoList/TodoList';

export const TodoApp = () => {
  const { todos, filterBy, tempTodo } = useContext(TodosContext);
  const preparedTodosList = filterTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!(todos.length || tempTodo) && (
          <TodosList todos={preparedTodosList} />
        )}

        {!!todos.length && <Footer />}
      </div>

      <ErrorComponent />
    </div>
  );
};
