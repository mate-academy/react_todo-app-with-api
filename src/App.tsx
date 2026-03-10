/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosServices from './api/todos';
import { Todo } from './types/Todo';
import { ErrorEnum, ErrorType } from './types/Error';
import { handleError } from './services/ErrorHandling';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { USER_ID } from './variables/UserID';
import { Error } from './components/ErrorBlock';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [activeUpdate, setActiveUpdate] = useState<Todo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempUpdated, setTempUpdated] = useState<Todo | null>(null);

  const [activeTodo, setActiveTodo] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const [filter, setFilter] = useState<Filter>(Filter.ALL);

  const [, setErrorCounter] = useState(0);

  const loadTodos = async () => {
    try {
      const todosData = await todosServices.getTodos().then(data => data);

      setTodosList(todosData);
    } catch (error) {
      setErrorCounter(current => {
        const newValue = current + 1;

        handleError(setErrorType, {
          type: ErrorEnum.LOADING,
          errorAmount: newValue,
        });

        return newValue;
      });
      throw error;
    }
  };

  const todos = useMemo(() => {
    return [...todosList].filter((current: Todo) => {
      if (filter === Filter.ACTIVE) {
        return !current.completed;
      }

      if (filter === Filter.COMPLETED) {
        return current.completed;
      }

      return current;
    });
  }, [filter, todosList]);

  const todosCounter: number = useMemo(() => {
    return [...todosList].filter((todo: Todo) => todo.completed === false)
      .length;
  }, [todosList]);

  const deleteTodo = async (todoId: number) => {
    handleError(setErrorType, null);

    try {
      await todosServices.deleteTodos(todoId);

      return setTodosList(currentTodos => {
        return currentTodos.filter(
          (currentTodo: Todo) => currentTodo.id !== todoId,
        );
      });
    } catch (error) {
      setErrorCounter(current => {
        const newValue = current + 1;

        handleError(setErrorType, {
          type: ErrorEnum.DELETE,
          errorAmount: newValue,
        });

        return newValue;
      });
      throw error;
    } finally {
      setActiveTodo([]);
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    setTempUpdated(updatedTodo);

    if (updatedTodo.title.trim() === '') {
      try {
        await deleteTodo(updatedTodo.id);
      } catch {
        setErrorCounter(current => {
          const newValue = current + 1;

          handleError(setErrorType, {
            type: ErrorEnum.DELETE,
            errorAmount: newValue,
          });

          return newValue;
        });
      } finally {
        setTempUpdated(null);
      }

      return;
    }

    try {
      await todosServices.updateTodos(updatedTodo);

      setTodosList(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );

      setActiveUpdate(null);
      setTempUpdated(null);
    } catch (error) {
      setTodosList(todosList);
      if (activeUpdate && updatedTodo.title === '') {
        setErrorCounter(current => {
          const newValue = current + 1;

          handleError(setErrorType, {
            type: ErrorEnum.UPDATE,
            errorAmount: newValue,
          });

          return newValue;
        });
        setTempUpdated(null);
        setActiveUpdate(null);
        throw error;
      }

      setErrorCounter(current => {
        const newValue = current + 1;

        handleError(setErrorType, {
          type: ErrorEnum.UPDATE,
          errorAmount: newValue,
        });

        return newValue;
      });
      setTempUpdated(null);
      throw error;
    }
  };

  const completeTodo = (
    todo: Todo,
    activeTodos: Todo[] = [todo],
    state?: boolean,
  ) => {
    const completedTodo: Todo = {
      ...todo,
      completed: state ? state : !todo.completed,
    };

    setActiveTodo([...activeTodos]);

    todosServices
      .updateTodos(completedTodo)
      .then(() => {
        setTodosList(currentTodos => {
          const copiedTodo: Todo[] = [...currentTodos];
          const index: number = copiedTodo.findIndex(
            (current: Todo) => current.id === completedTodo.id,
          );

          copiedTodo.splice(index, 1, completedTodo);

          return copiedTodo;
        });
      })
      .catch((error: Error) => {
        setErrorCounter(current => {
          const newValue = current + 1;

          handleError(setErrorType, {
            type: ErrorEnum.UPDATE,
            errorAmount: newValue,
          });

          return newValue;
        });
        throw error;
      })
      .finally(() => {
        setActiveTodo([]);
      });
  };

  const completeAllTodos = async () => {
    const completedAll: boolean = [...todosList].every((current: Todo) => {
      return current.completed;
    });

    const currentTodos: Todo[] = completedAll
      ? [...todosList]
      : [...todosList].filter(current => !current.completed);

    const promiseArray = currentTodos.map((todo: Todo) =>
      completeTodo(todo, currentTodos, !completedAll),
    );

    try {
      await Promise.all([...promiseArray]);
    } catch (error) {
      setErrorCounter(current => {
        const newValue = current + 1;

        handleError(setErrorType, {
          type: ErrorEnum.UPDATE,
          errorAmount: newValue,
        });

        return newValue;
      });
      throw error;
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosList={todosList}
          todosCounter={todosCounter}
          activeTodo={activeTodo}
          setTodosList={setTodosList}
          completeAll={completeAllTodos}
          setErrorType={setErrorType}
          setTempTodo={setTempTodo}
          setActiveTodo={setActiveTodo}
          setErrorCounter={setErrorCounter}
        />

        <TodosList
          todos={todos}
          activeTodo={activeTodo}
          activeUpdate={activeUpdate}
          tempTodo={tempTodo}
          tempUpdated={tempUpdated}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
          setActiveTodo={setActiveTodo}
          setActiveUpdate={setActiveUpdate}
          updateTodo={updateTodo}
        />

        {todosList.length > 0 && (
          <Footer
            todosList={todosList}
            todosCounter={todosCounter}
            filter={filter}
            setFilter={setFilter}
            onDelete={deleteTodo}
            setActiveTodo={setActiveTodo}
            setErrorType={setErrorType}
            setErrorCounter={setErrorCounter}
          />
        )}
      </div>

      <Error errorType={errorType} setErrorType={setErrorType} />
    </div>
  );
};
