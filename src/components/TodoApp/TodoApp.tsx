import { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

import { filteredTodos } from '../../services/filterTodos';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp = () => {
  const {
    todos,
    filterTodos,
  } = useContext(TodosContext);

  const filteredItems = filteredTodos(todos, filterTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <Main items={filteredItems} />
        )}

        {!!todos.length && (
          <Footer />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
