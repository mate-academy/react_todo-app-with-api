/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './context/TodosContext';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const { todos, filterStatus, tempTodo } = useTodos();

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      case Status.All:
      default:
        return todo;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList
          todos={filteredTodos}
          filterStatus={filterStatus}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
