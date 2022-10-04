/* eslint-disable no-console */
import React, {
  // useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  const newTodoField = useRef<HTMLInputElement>(null);

  const focusOnInput = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  useEffect(() => {
    focusOnInput();

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

  const hundleAddTodo = async (inputTitle: string) => {
    setTitle(inputTitle);
    setIsTodoAdded(true);

    try {
      if (user) {
        const newTodo = await postTodo(user.id, inputTitle);

        setTodos([...todos, newTodo]);
      }
    } catch {
      setErrorMessage('Unable to add todo');
    } finally {
      setIsTodoAdded(false);
      focusOnInput();
    }
  };

  const hundleDeleteTodo = (todosIds: number[]) => {
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
  };

  const hundleUpdateTodo = (event: any, todosIds: number[]) => {
    const {
      name, value, type, checked,
    } = event.target;

    setSelectedTodosIds(todosIds);
    Promise.all(
      todosIds.map(todoId => (
        patchTodo(todoId, {
          [name]: type === 'checkbox' ? checked : value === 'true',
        })
          .then(() => {
            setTodos(prevTodos => (
              prevTodos.map(prevTodo => {
                if (prevTodo.id === todoId) {
                  return {
                    ...prevTodo,
                    [name]: type === 'checkbox' ? checked : value === 'true',
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
  };

  const hundleRenameTodo = (newTitle: string, todoId: number) => {
    setSelectedTodosIds([todoId]);
    patchTodo(todoId, { title: newTitle })
      .then(() => {
        if (setTodos && todos) {
          setTodos((prevTodos: Todo[]) => (
            prevTodos.map(prevTodo => {
              if (prevTodo.id === todoId) {
                return {
                  ...prevTodo,
                  title: newTitle,
                };
              }

              return prevTodo;
            })
          ));
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update todo');
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  };

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
          newTodoField={newTodoField}
          isLeftActiveTodos={isLeftActiveTodos}
          onAddTodo={hundleAddTodo}
          isDisabled={isTodoAdded}
          setErrorMessage={setErrorMessage}
          activeTodosIds={activeTodosIds}
          completedTodosIds={completedTodosIds}
          onUpdate={hundleUpdateTodo}
        />
        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            isAdding={isTodoAdded}
            selectedTodosIds={selectedTodosIds}
            newTitle={title}
            onDelete={hundleDeleteTodo}
            onUpdate={hundleUpdateTodo}
            onRename={hundleRenameTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            activeTodosTotal={activeTodosTotal}
            isLeftCompletedTodos={isLeftCompletedTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            completedTodosIds={completedTodosIds}
            onDelete={hundleDeleteTodo}
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
