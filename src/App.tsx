import React, { useCallback, useEffect, useState } from 'react';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todolist } from './components/Todolist';
import { FilterValues } from './constants';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6438;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [errorType, setErrorType] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterValues.ALL);
  const activeTodos = [...todos].filter(todoItem => !todoItem.completed);
  const isEveryCompleted = todos.every(todoItem => todoItem.completed);
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const getTodosFromServer = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setHasError(true);
      setErrorType('upload');
    }
  };

  const handleAddTodo = useCallback(async () => {
    const newTodoToFetch = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const newTodoToShow = {
      ...newTodoToFetch,
      id: 0,
    };

    setIsTodoAdding(true);
    setTempTodo(newTodoToShow);

    try {
      const addedTodo = await addTodo(newTodoToFetch);

      setTodos(prevTodos => [...prevTodos, addedTodo]);

      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorType('add');
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  }, [title]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    try {
      await removeTodo(todoId);

      const updatedTodos = [...todos].filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType('delete');
    } finally {
      setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todoId));
    }
  }, [todos]);

  const clearCompletedTodos = useCallback(async () => {
    const completedTodosIds = [...todos]
      .filter(todo => todo.completed)
      .map((todo) => todo.id);

    setRemovingTodoIds(completedTodosIds);

    Promise.all(completedTodosIds.map((id) => removeTodo(id)))
      .then(() => {
        setTodos(activeTodos);
      })
      .catch(() => {
        setHasError(true);
        setErrorType('delete');
      })
      .finally(() => setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => !completedTodosIds.includes(id))));
  }, [hasCompletedTodo, activeTodos]);

  const handleChangeStatus = useCallback(async (todo: Todo) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      await updateTodo(todo.id, updatedTodo);

      const updatedTodos = [...todos].map(todoItem => {
        const currentTodo = todoItem;

        if (currentTodo.id === updatedTodo.id) {
          currentTodo.completed = updatedTodo.completed;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType('update');
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [activeTodos]);

  const handleChangeTitle = useCallback(async (
    todo: Todo,
    newTitle: string,
  ) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    const updatedTodo = {
      ...todo,
      title: newTitle,
    };

    try {
      await updateTodo(todo.id, updatedTodo);

      const updatedTodos = [...todos].map(todoItem => {
        const currentTodo = todoItem;

        if (currentTodo.id === updatedTodo.id) {
          currentTodo.title = updatedTodo.title;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType('update');
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [title, updatingTodoIds, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case FilterValues.COMPLETED:
        return todo.completed;

      case FilterValues.ACTIVE:
        return !todo.completed;

      default: return true;
    }
  });

  const toggleAll = () => {
    if (isEveryCompleted) {
      const toggleToActive = [...todos].map(todoItem => {
        if (todoItem.completed) {
          handleChangeStatus(todoItem);

          return {
            ...todoItem,
            completed: false,
          };
        }

        return todoItem;
      });

      setTodos(toggleToActive);
    } else {
      const toggleToComplited = [...todos].map(todoItem => {
        if (!todoItem.completed) {
          handleChangeStatus(todoItem);

          return {
            ...todoItem,
            completed: true,
          };
        }

        return todoItem;
      });

      setTodos(toggleToComplited);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          todos={todos}
          setTitle={setTitle}
          onAdd={handleAddTodo}
          toggleAll={toggleAll}
          onError={setHasError}
          setErrorType={setErrorType}
          isTodoAdding={isTodoAdding}
          isToggleAllActive={isEveryCompleted}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <Todolist
              tempTodo={tempTodo}
              todos={visibleTodos}
              onDelete={handleDeleteTodo}
              updatingTodoIds={updatingTodoIds}
              removingTodoIds={removingTodoIds}
              handleChangeTitle={handleChangeTitle}
              setUpdatingTodoIds={setUpdatingTodoIds}
              handleChangeStatus={handleChangeStatus}
            />

            <Footer
              todos={todos}
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        ) }
      </div>

      {hasError && (
        <ErrorNotification
          hasError={hasError}
          errorType={errorType}
          setHasError={setHasError}
        />
      )}
    </div>
  );
};
