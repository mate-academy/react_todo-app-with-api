/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { USER_ID, getTodos, createTodo, onDelete, onChange } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  function getVisibleTodos(newTodos: Todo[], newStatus: Status) {
    switch (newStatus) {
      case Status.Active:
        return newTodos.filter(todo => !todo.completed);

      case Status.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visibleTodos = getVisibleTodos(todos, status);

  const addTodo = (todoTitle: string) => {
    const newTitle = todoTitle.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);

    return onDelete(id)
      .then(() => {
        setTodos(todoState => todoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCompletedTodo = () => {
    setIsLoading(true);

    const completedTodos = todos.filter(item => item.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const handleRename = (todo: Todo) => {
    setLoadingTodo(todo);
    setIsLoading(true);

    onChange(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodo(null);
        setIsLoading(true);
      });
  };

  const handleToggleStatus = (todo: Todo) => {
    setLoadingTodo(todo);
    setIsLoading(true);

    onChange({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodo(null);
        setIsLoading(false);
      });
  };

  const handleToggleAllStatus = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      completedTodos.forEach(handleToggleStatus);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
          handleToggleAllStatus={handleToggleAllStatus}
          todos={todos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          handleToggleStatus={handleToggleStatus}
          handleRename={handleRename}
          loadingTodo={loadingTodo}
          setLoadingTodo={setLoadingTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
