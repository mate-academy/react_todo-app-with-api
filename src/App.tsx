import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorField } from './components/ErrorField/ErrorField';
import { FilterState } from './types/FilterState';
import { getPreparedTodos } from './utils/getPreperedTodos';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NONE);
  const [activeFilter, setActiveFilter] = useState<FilterState>(
    FilterState.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);
  const [isTtitleChanging, setIsTtitleChanging] = useState(false);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const preparedTodos = getPreparedTodos(todos, activeFilter);

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorMessage(Errors.DELETE);
      })
      .finally(() => {
        setLoadingTodos((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodo = (todoId: number, updatedData: {}) => {
    setLoadingTodos(prev => [...prev, todoId]);
    updateTodo(todoId, updatedData)
      .then((updatedTodo: Todo) => {
        setTodos((prev: Todo[]) => {
          const prevCopy = [...prev];

          const updatedTodoIndex = prev.findIndex(
            todo => todo.id === updatedTodo.id,
          );

          prevCopy[updatedTodoIndex] = updatedTodo;

          return prevCopy;
        });
        setIsTtitleChanging(false);
      })
      .catch(() => {
        setErrorMessage(Errors.UPDATE);
      })
      .finally(() => {
        setLoadingTodos((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOAD));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          handleUpdateTodo={handleUpdateTodo}
          isTtitleChanging={isTtitleChanging}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
          handleUpdateTodo={handleUpdateTodo}
          setIsTtitleChanging={setIsTtitleChanging}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorField
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
