import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { FilterValues } from './types/FilterValues';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterValues.ALL);
  const [title, setTitle] = useState('');
  const [isTodoAdded, setIsTodoAdded] = useState(false);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);

  useEffect(() => {
    const getTodosAsync = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    if (user) {
      getTodosAsync(user.id);
    }
  }, []);

  const hundleAddTodo = useCallback(async (inputTitle: string) => {
    setTitle(inputTitle);
    setIsTodoAdded(true);

    try {
      if (user) {
        const newTodo = await postTodo(user.id, inputTitle);

        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
    } catch {
      setErrorMessage('Unable to add todo');
    } finally {
      setIsTodoAdded(false);
    }
  }, []);

  const hundleDeleteTodos = useCallback((todosIds: number[]) => {
    setSelectedTodosIds(todosIds);
    Promise.all(todosIds.map(todoId => (
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
        })
    )))
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  }, []);

  const getValidValue = useCallback((value: string | boolean, type: string) => {
    const newValue = typeof value === 'boolean' ? String(value) : value;

    return type === 'submit' ? newValue : newValue === 'true';
  }, []);

  const hundleUpdateTodos = useCallback((
    name: string,
    type: string,
    value: string | boolean,
    todosIds: number[],
  ) => {
    const validValue = getValidValue(value, type);

    setSelectedTodosIds(todosIds);
    Promise.all(
      todosIds.map(todoId => (
        patchTodo(todoId, {
          [name]: validValue,
        })
          .then(() => {
            setTodos(prevTodos => (
              prevTodos.map(prevTodo => {
                if (prevTodo.id === todoId) {
                  return {
                    ...prevTodo,
                    [name]: validValue,
                  };
                }

                return prevTodo;
              })
            ));
          })
      )),
    )
      .catch(() => {
        setErrorMessage('Unable to update todo');
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterValue) {
        case FilterValues.ACTIVE:
          return !completed;

        case FilterValues.COMPLETED:
          return completed;

        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  const activeTodosTotal = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const completedTodosIds = useMemo(() => {
    return todos.reduce((todosId: number[], currTodo: Todo) => {
      if (currTodo.completed) {
        todosId.push(currTodo.id);
      }

      return todosId;
    }, []);
  }, [todos]);

  const activeTodosIds = useMemo(() => {
    return todos.reduce((todosId: number[], currTodo: Todo) => {
      if (!currTodo.completed) {
        todosId.push(currTodo.id);
      }

      return todosId;
    }, []);
  }, [todos]);

  const isLeftActiveTodos = activeTodosTotal !== 0;
  const isLeftCompletedTodos = activeTodosTotal !== todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLeftActiveTodos={isLeftActiveTodos}
          onAddTodo={hundleAddTodo}
          isDisabled={isTodoAdded}
          setErrorMessage={setErrorMessage}
          activeTodosIds={activeTodosIds}
          completedTodosIds={completedTodosIds}
          onUpdate={hundleUpdateTodos}
        />
        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            isAdding={isTodoAdded}
            selectedTodosIds={selectedTodosIds}
            newTitle={title}
            onDelete={hundleDeleteTodos}
            onUpdate={hundleUpdateTodos}
          />
        )}
        {!!todos.length && (
          <Footer
            activeTodosTotal={activeTodosTotal}
            isLeftCompletedTodos={isLeftCompletedTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            completedTodosIds={completedTodosIds}
            onDelete={hundleDeleteTodos}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
