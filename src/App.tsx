/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const comletedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function getVisiebleTodos(newTodos: Todo[], newStatus: Status) {
    switch (newStatus) {
      case Status.Active:
        return newTodos.filter(todo => !todo.completed);

      case Status.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visiebleTodos = getVisiebleTodos(todos, status);

  const addTodo = (newTodoTitle: string) => {
    const todoTitle = query.trim();

    if (!todoTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    });

    setLoadingTodos(curr => [...curr, 0]);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(curTodos => [...curTodos, newTodo]);

        setQuery('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(curr => curr.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(curr => [...curr, todoId]);

    return deleteTodo(todoId)
      .then(() =>
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() =>
        setLoadingTodos(curr =>
          curr.filter(deletingTodoId => todoId !== deletingTodoId),
        ),
      );
  };

  const deleteAllComleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleStatus = (todo: Todo) => {
    setLoadingTodos(curr => [...curr, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currTodos =>
          currTodos.map(currTodo =>
            currTodo.id === updatedTodo.id ? updatedTodo : currTodo,
          ),
        ),
      )
      .catch(() => setError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(curr => curr.filter(id => id !== todo.id));
      });
  };

  const handleAllToggleStatus = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      comletedTodos.forEach(handleToggleStatus);
    }
  };

  const handleRenameTodo = async (todo: Todo) => {
    setLoadingTodos(curr => [...curr, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => {
        setError('Unable to update a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setLoadingTodos(curr => curr.filter(id => id !== todo.id));
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
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          onToggleAll={handleAllToggleStatus}
        />

        {!!todos.length && (
          <TodoList
            visiebleTodos={visiebleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingTodos={loadingTodos}
            onToggle={handleToggleStatus}
            onUpdate={handleRenameTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={deleteAllComleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
