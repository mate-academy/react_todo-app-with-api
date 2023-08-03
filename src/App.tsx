/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Error } from './types/Error';
import { Header } from './components/Header';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Status } from './types/Status';

const USER_ID = 11126;

const getVisibleTodos = (todos: Todo[], status: Status) => {
  return todos
    .filter(todo => {
      switch (status) {
        case Status.Completed:
          return todo.completed;

        case Status.Active:
          return !todo.completed;

        default:
          return true;
      }
    });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState(Status.All);

  const count = useMemo(() => todos.reduce(
    (total, todo) => (todo.completed ? total : total + 1),
    0,
  ), [todos]);

  const errorTimerId = useRef(0);

  const showError = (message: string) => {
    setErrorMessage(message);

    window.clearTimeout(errorTimerId.current);

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(Error.Load))
      .finally(() => { });
  }, []);

  const addTodo = (title: string) => {
    setTempTodo({
      id: 0,
      completed: false,
      title,
      userId: 11126,
    });

    return createTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch((error) => {
        showError(Error.Add);
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const deleteTodo = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);
    removeTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        showError(Error.Delete);
        throw error;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setProcessingIds(ids => [...ids, todoToUpdate.id]);
    updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos
          .map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
      })
      .catch((error) => {
        showError(Error.Toggle);
        throw error;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
      });
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    setProcessingIds(ids => [...ids, todoToUpdate.id]);
    updateTodo({ ...todoToUpdate, title: newTitle })
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos
          .map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
      })
      .catch((error) => {
        showError(Error.Update);
        throw error;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
      });
  };

  const allCompleted = todos.every(todo => todo.completed);
  const completedTodo = todos.some(todo => todo.completed);

  const toggleAll = () => {
    if (allCompleted) {
      todos.forEach(toggleTodo);

      return;
    }

    const activeTodos = todos.filter(todo => !todo.completed);

    activeTodos.forEach(toggleTodo);
  };

  const clearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  };

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, status);
  }, [todos, status]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onAdd={addTodo}
          onToggleAll={toggleAll}
        />
        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={() => deleteTodo(todo.id)}
              onRename={(newTitle) => renameTodo(todo, newTitle)}
              onToggle={() => toggleTodo(todo)}
              processing={processingIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              processing
              onDelete={() => {}}
              onRename={() => {}}
              onToggle={() => {}}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            completedTodo={completedTodo}
            count={count}
            status={status}
            setStatus={setStatus}
            clearCompleted={clearCompleted}
          />
        )}

      </div>
      <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
