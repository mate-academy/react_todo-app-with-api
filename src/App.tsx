/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Error } from './Error';
import { Header } from './Header';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import * as postService from './api/todos';
import { Status } from './types/Status';

export const USER_ID = 11894;

function getVisibleTodos(todos: Todo[], newStatus: Status) {
  return todos.filter(({ completed }) => {
    switch (newStatus) {
      case Status.ACTIVE:
        return !completed;
      case Status.COMPLETED:
        return completed;
      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const visibleTodos = getVisibleTodos(todos, filter);

  const areAllTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setErrorMessage]);

  const toggleTodo = (todoId: number) => {
    setIsLoading(true);
    const todo = todos.find(t => t.id === todoId);

    if (todo) {
      postService.updatedTodo(todoId, { ...todo, completed: !todo.completed })
        .then(updatedTodo => {
          setTodos(todos.map(t => {
            return t.id === todoId ? updatedTodo : t;
          }));
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          clearError();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const toggleAll = () => {
    setIsLoading(true);
    const updatedStatus = !areAllTodosCompleted;
    const promises = todos
      .filter(todo => todo.completed !== updatedStatus)
      .map(todo => postService.updatedTodo(todo.id, { ...todo, completed: updatedStatus }));

    Promise.all(promises)
      .then(updatedTodos => {
        setTodos(todos.map(todo => {
          const updatedTodo = updatedTodos.find(t => t.id === todo.id);

          return updatedTodo || todo;
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update todos');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearCompletedTodos = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const loadTodos = () => {
    setErrorMessage('');
    postService.getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        clearError();
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filterById = (filteredTodos: Todo[], id: number) => {
    return filteredTodos.filter(todo => todo.id !== id);
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    setIsLoading(true);

    const promise = postService.createTodo({
      userId, title: title.trim(), completed,
    })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });

    setTempTodo({
      id: 0, userId: USER_ID, title, completed,
    });

    return promise;
  };

  const deleteTodo = useCallback((todoId: number) => {
    setIsLoading(true);
    setDeletingTodoId(todoId);
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => filterById(currentTodos, todoId));
        setDeletingTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        clearError();
        setDeletingTodoId(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setTodos, clearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          isLoading={isLoading}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
          clearError={clearError}
          areAllTodosCompleted={areAllTodosCompleted}
          toggleAll={toggleAll}
        />

        {visibleTodos && (
          <TodoList
            tempTodo={tempTodo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            visibleTodos={visibleTodos}
            deleteTodo={deleteTodo}
            deletingTodoId={deletingTodoId}
            toggleTodo={toggleTodo}
            todoTitle={todoTitle}
            setTodoTitle={setTodoTitle}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            currentFilter={filter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
