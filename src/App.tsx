/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import {
  getTodos,
  deleteTodo,
  updateTodoComplited,
  updateTodoTitle,
} from './api/todos';

const USER_ID = 10283;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean | string>(false);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setIsLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(0);
  const [comletedTodos, setCompletedTodos] = useState<Todo[] | null>(null);
  let visibleTodos: Todo[] | null = todos;

  if (filter === 'active') {
    visibleTodos = todos ? todos.filter(todo => !todo.completed) : null;
  }

  if (filter === 'completed') {
    visibleTodos = todos ? todos.filter(todo => todo.completed) : null;
  }

  const loadTodos = async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch {
      setError('load');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingID(todoId);
      setIsLoading(true);
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError('delete');
    }

    setIsLoading(false);
  };

  const handleEditTodo = async (newTitle: string, id: number) => {
    if (!newTitle) {
      handleDeleteTodo(id);

      return;
    }

    setLoadingID(id);
    setIsLoading(true);
    try {
      await updateTodoTitle(id, {
        title: newTitle,
      });
    } catch {
      setError('edit');
    }

    setIsLoading(false);
    loadTodos();
  };

  const handleUpdateTodoIsCompleted = async (
    id: number,
    complitedCurrVal: boolean,
  ) => {
    try {
      setLoadingID(id);
      setIsLoading(true);
      await updateTodoComplited(id, {
        completed: !complitedCurrVal,
      });
      await loadTodos();
    } catch {
      setError('update');
    }

    setIsLoading(false);
  };

  const handleToggleAllComplited = () => {
    if (todos) {
      const todosCurrValue = todos?.every(todo => todo.completed === true);

      todos?.forEach(todo => {
        handleUpdateTodoIsCompleted(todo.id, todosCurrValue);
      });
    }
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleSetError = (errVal: string | boolean) => {
    setError(errVal);
  };

  const HandleSelectFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleClearComplitedTodos = () => {
    comletedTodos?.map(todo => handleDeleteTodo(todo.id));
  };

  const updateTodos = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos as Todo[], todo]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (todos) {
      setCompletedTodos(todos?.filter(todoa => todoa.completed));
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={handleSetError}
          handleSetTempTodo={handleSetTempTodo}
          userId={USER_ID}
          updateTodos={updateTodos}
          onToggle={handleToggleAllComplited}
          todos={todos}
        />
        {todos && (
          <>
            <Main
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              loading={loading}
              loadingID={loadingID}
              handleUpdateTodoIsCompleted={handleUpdateTodoIsCompleted}
              editTodo={handleEditTodo}
            />

            <Footer
              setFilter={HandleSelectFilter}
              selectedFilter={filter}
              comletedTodos={comletedTodos}
              clearComplitedTodos={handleClearComplitedTodos}
            />
          </>
        )}
      </div>
      {error
      && (
        <Notification
          setError={handleSetError}
          errorText={error}
        />
      )}
    </div>
  );
};
