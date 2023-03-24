/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoNotification } from './components/TodoNotification';
import { getTodos, postTodo, deleteTodo, patchTodo } from './api/todos';
import { filterTodos } from './utils';
import { Error, Filter, Todo, ErrorType, Property } from './types';

const initialError: Error = {
  state: false,
  type: ErrorType.None,
};

const USER_ID = 6657;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(Filter.All);
  const [error, setError] = useState(initialError);
  const [removedTodoId, setRemovedTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedStatus, setCompletedStatus] = useState(false);
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterType);
  }, [todos, filterType]);

  useEffect(() => {
    try {
      const serverTodos = async () => {
        const response = await getTodos(USER_ID);

        return response;
      };

      serverTodos()
        .then(setTodos);
    } catch {
      setError({
        state: true,
        type: ErrorType.Update,
      });
    }
  }, []);

  const addTodo = (title: string) => {
    if (!title) {
      setError({
        state: true,
        type: ErrorType.EmptyTitle,
      });

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    postTodo(USER_ID, {
      userId: USER_ID,
      title,
      completed: false,
    }).then(response => {
      setTodos(prev => (
        [
          ...prev,
          response,
        ]
      ));
    })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setRemovedTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(currentTodo => currentTodo.id !== id));
      })
      .catch(() => {
        setError({
          state: true,
          type: ErrorType.Delete,
        });
      })
      .finally(() => {
        setRemovedTodoId(null);
      });
  };

  const updateTodo = (id: number, data: Property) => {
    setRemovedTodoId(id);
    patchTodo(id, data)
      .then((response) => {
        const updatedTodos = [...todos];
        const changedTodoId = [...todos].findIndex(todo => todo.id === id);

        updatedTodos[changedTodoId] = response;
        setTodos(updatedTodos);
      })
      .catch(() => {
        setError({
          state: true,
          type: ErrorType.Update,
        });
      })
      .finally(() => {
        setRemovedTodoId(null);
      });
  };

  const toggleCompletedStatus = () => {
    setIsLoading(true);
    setCompletedStatus(prev => !prev);

    const updatedPromises = todos.map(todo => {
      return patchTodo(todo.id, { completed: completedStatus });
    });

    Promise.all(updatedPromises)
      .then(setTodos)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeCompletedTodos = () => {
    const completed = todos.filter(todo => todo.completed);
    const uncompleted = todos.filter(todo => !todo.completed);
    const removePromises = completed.map(todo => deleteTodo(todo.id));

    Promise.all(removePromises)
      .then(() => setTodos(uncompleted))
      .catch(() => {
        setError({
          state: true,
          type: ErrorType.Delete,
        });
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          tempTodo={tempTodo}
          toggleCompletedStatus={toggleCompletedStatus}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              removedTodoId={removedTodoId}
              updateTodo={updateTodo}
              isLoadingAll={isLoading}
            />
            <Footer
              todos={todos}
              setFilter={setFilterType}
              filter={filterType}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {error.state && (
        <TodoNotification
          setError={setError}
          errorText={error.type}
        />
      )}
    </div>
  );
};
