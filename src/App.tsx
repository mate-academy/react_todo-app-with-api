/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';
import { TodosContext } from './utils/TodosContext';
import { ErrorContext } from './utils/ErrorContextProvider';

export const USER_ID = 11338;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { error, errorVisibility, showError } = useContext(ErrorContext);
  const [filter, setFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case Filters.Completed: {
        return [...todos].filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }, [todos, filter]);

  const addTodoHandler = ({
    id,
    userId,
    title,
    completed,
  }: Todo) => {
    setTempTodo({
      id,
      userId,
      title,
      completed,
    });

    return createTodo({ title, userId, completed })
      .then((newTodo) => setTodos((current) => [...current, newTodo]))
      .catch(() => showError(Errors.Add))
      .finally(() => setTempTodo(null));
  };

  const deleteAllHandler = () => {
    const completed = todos.filter(todo => todo.completed).map(todo => todo.id);

    setProcessingTodos(completed);

    Promise.all(todos.filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id)))
      .then(() => setTodos(currentTodos => {
        return currentTodos.filter(todo => !todo.completed);
      }))
      .catch(() => showError(Errors.Delete))
      .finally(() => setProcessingTodos([]));
  };

  const toggleAllHandler = () => {
    const toggleTodos = (arr: Todo[], condition: boolean) => {
      Promise.allSettled(arr.map(todo => {
        return updateTodo(todo.id, { completed: condition });
      }))
        .then((results) => {
          results.forEach(res => {
            if (res.status === 'fulfilled') {
              setTodos((current) => {
                return current.map(todo => {
                  if (todo.id === res.value.id) {
                    return { ...todo, completed: condition };
                  }

                  return todo;
                });
              });
            } else {
              showError(Errors.Update);
            }
          });
        })
        .finally(() => setProcessingTodos([]));
    };

    if (todos.some(todo => !todo.completed)) {
      const uncompleted = todos.filter(todo => !todo.completed);

      setProcessingTodos(uncompleted.map(todo => todo.id));

      toggleTodos(uncompleted, true);
    } else {
      setProcessingTodos(todos.map(todo => todo.id));

      toggleTodos(todos, false);
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((setTodos))
      .catch(() => {
        showError(Errors.Load);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            userId={USER_ID}
            onAdd={addTodoHandler}
            onToggleAll={toggleAllHandler}
          />

          <Main
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingTodos={processingTodos}
          />

          {!!todos.length && (
            <Footer
              filter={filter}
              onFilter={(value) => setFilter(value)}
              onClear={() => {
                deleteAllHandler();
              }}
            />
          )}
        </div>

        <ErrorMessage
          error={error}
          isVisible={errorVisibility}
        />
      </div>
    </TodosContext.Provider>
  );
};
