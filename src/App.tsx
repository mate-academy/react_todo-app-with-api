import React, { useCallback, useContext, useEffect } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos } from './api/todos';
import { AppTodoContext } from './contexts/AppTodoContext';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TodoAppError } from './components/Error/TodoAppError';
import { USER_ID } from './react-app-env';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import {ErrorType} from "./types/enums";

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    activeTodos,
  } = useContext(AppTodoContext);

  const getAllTodos = useCallback(async () => {
    try {
      const allTodos = await getTodos(USER_ID);

      setTodos(allTodos);
    } catch {
      setErrorMessage(ErrorType.GetAllTodosError);
    }
  }, []);

  useEffect(() => {
    getAllTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <NewTodoForm />

        </header>

        {todos.length !== 0 && <TodoList />}

      </div>

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos.length} items left`}
        </span>

        <TodoFilter />
      </footer>

      <TodoAppError />
    </div>
  );
};
