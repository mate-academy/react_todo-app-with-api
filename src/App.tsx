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
import { ErrorTypes, FilterValues } from './constants';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6438;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [errorType, setErrorType] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterValues.ALL);

  const activeTodos = todos.filter(todoItem => !todoItem.completed);
  const completedTodos = todos.filter(todoItem => todoItem.completed);
  const isEveryCompleted = todos.every(todoItem => todoItem.completed);
  const hasCompletedTodo = todos.some(todo => todo.completed);
  const activeTodosIds = todos
    .filter(todo => !todo.completed)
    .map((todo) => todo.id);
  const completedTodosIds = todos
    .filter(todo => todo.completed)
    .map((todo) => todo.id);

  const visibleTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case FilterValues.COMPLETED:
        return todo.completed;

      case FilterValues.ACTIVE:
        return !todo.completed;

      default: return true;
    }
  });

  const getTodosFromServer = async () => {
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.UPLOAD);
    }
  };

  const handleAddTodo = useCallback(async () => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const newTodoToShow = {
      ...newTodo,
      id: 0,
    };

    setIsTodoAdding(true);
    setTempTodo(newTodoToShow);

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      setErrorType(ErrorTypes.ADD);
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  }, [title]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    try {
      await removeTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.DELETE);
    } finally {
      setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todoId));
    }
  }, [todos]);

  const clearCompletedTodos = useCallback(async () => {
    setRemovingTodoIds(completedTodosIds);

    Promise.all(completedTodosIds.map((id) => removeTodo(id)))
      .then(() => {
        setTodos(activeTodos);
      })
      .catch(() => {
        setErrorType(ErrorTypes.DELETE);
      })
      .finally(() => setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => !completedTodosIds.includes(id))));
  }, [hasCompletedTodo, activeTodos]);

  const handleChangeStatus = useCallback(async (todo: Todo) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      const updatedTodos = todos.map(todoItem => {
        if (todoItem.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE);
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [activeTodosIds, completedTodosIds]);

  const handleChangeTitle = useCallback(async (
    todo: Todo,
    newTitle: string,
  ) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        title: newTitle,
      });

      const updatedTodos = todos.map(todoItem => {
        if (todoItem.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todoItem;
      });

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType(ErrorTypes.UPDATE);
    } finally {
      setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id !== todo.id));
    }
  }, [title, updatingTodoIds, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const toggleAll = useCallback(async () => {
    const updateActive = () => {
      return todos.map(todo => {
        setUpdatingTodoIds(activeTodosIds);

        if (!todo.completed) {
          return updateTodo(todo.id, {
            ...todo,
            completed: !todo.completed,
          });
        }

        return todo;
      });
    };

    const updateCompleted = () => {
      return completedTodos.map(todo => {
        setUpdatingTodoIds(completedTodosIds);

        return updateTodo(todo.id, {
          ...todo,
          completed: !todo.completed,
        });
      });
    };

    const updatingTodos = isEveryCompleted
      ? updateCompleted()
      : updateActive();

    Promise.all(updatingTodos)
      .then((response) => setTodos(response))
      .catch(() => {
        setErrorType(ErrorTypes.UPDATE);
      })
      .finally(() => setUpdatingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => updatingTodoIds.includes(id))));
  }, [handleChangeStatus, completedTodos, activeTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

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
              activeTodos={activeTodos}
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        ) }
      </div>

      {errorType && (
        <ErrorNotification
          errorType={errorType}
          setErrorType={setErrorType}
        />
      )}
    </div>
  );
};
