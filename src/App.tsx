/* eslint-disable no-console */
import React, {
  // FormEvent,
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
  const [filterValue, setFilterValue] = useState('all');
  const [title, setTitle] = useState('');
  const [isTodoAdded, setIsTodoAdded] = useState(false);
  const [selectedTodosId, setSelectedTodosId] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);

  const focusOnInput = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  useEffect(() => {
    focusOnInput();

    getTodos(user?.id || 0)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
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

  const hundleDeleteTodo = (todosId: number[]) => {
    setSelectedTodosId(todosId);
    todosId.map(todoId => (
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
        })
        .catch(() => {
          setErrorMessage('Unable to delete todo');
        })
    ));
  };

  const hundleUpdateTodo = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    todosId: number[],
  ) => {
    const {
      name, value, type, checked,
    } = event.target;

    setSelectedTodosId(todosId);
    todosId.map(todoId => (
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
        .catch(() => {
          setErrorMessage('Unable to update todo');
        })
        .finally(() => {
          setSelectedTodosId([]);
        })
    ));
  };

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterValue) {
      case 'active':
        return !completed;

      case 'completed':
        return completed;

      default:
        return true;
    }
  });

  const activeTodosTotal = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const completedTodosId = useMemo(() => {
    return todos.reduce((todosId: number[], currTodo: Todo) => {
      if (currTodo.completed) {
        todosId.push(currTodo.id);
      }

      return todosId;
    }, []);
  }, [todos]);

  const activeTodosId = useMemo(() => {
    return todos.reduce((todosId: number[], currTodo: Todo) => {
      if (!currTodo.completed) {
        todosId.push(currTodo.id);
      }

      return todosId;
    }, []);
  }, [todos]);

  const isLeftActiveTodos = activeTodosTotal === 0;

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
          activeTodosId={activeTodosId}
          completedTodosId={completedTodosId}
          onUpdate={hundleUpdateTodo}
        />
        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            isAdding={isTodoAdded}
            selectedTodosId={selectedTodosId}
            newTitle={title}
            onDelete={hundleDeleteTodo}
            onUpdate={hundleUpdateTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            activeTodosTotal={activeTodosTotal}
            isLeftActiveTodos={isLeftActiveTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            completedTodosId={completedTodosId}
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
