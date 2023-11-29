import React, { useContext } from 'react';
import { Header } from './Header';
import { Todolist } from './TodoList';
import { Footer } from './Footer';
import { Error } from './Error';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';
import { UserWarning } from '../UserWarning';

export const TodoApp: React.FC = () => {
  const {
    userId,
    tempTodo,
    todos,
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  return userId ? (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {(todos.length !== 0 || tempTodo !== null) && (
          <>
            <Todolist />

            {(tempTodo) && (
              <TodoItem todo={tempTodo} />
            )}
            <Footer />
          </>
        )}
      </div>

      <Error errorMessage={errorMessage} setError={setErrorMessage} />
    </div>
  ) : (
    <UserWarning />
  );
};
