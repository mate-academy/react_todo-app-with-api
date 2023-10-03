/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { TodoContext } from './utils/TodoContext';

export const App: React.FC = () => {
  const [filterTodos, setFilterTodos] = useState<Filters>('All');

  const {
    todos,
    USER_ID,
    isVisibleErrorMessage,
  } = useContext(TodoContext);

  const handleFilterTodos
  = (todosArray: Todo[], option: Filters): Todo[] => {
    return todosArray.filter((todo) => {
      if (option === 'Active') {
        return !todo.completed;
      }

      if (option === 'Completed') {
        return todo.completed;
      }

      return true;
    });
  };

  const MadeTodoList = () => {
    return handleFilterTodos(todos, filterTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (

    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList
          todos={MadeTodoList()}
        />

        {todos.length !== 0 && (
          <Footer
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
          />
        )}
      </div>

      {isVisibleErrorMessage && <ErrorMessage />}
    </div>

  );
};
