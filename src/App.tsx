import React, { useState, useEffect, useMemo } from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { FilteredBy } from './types/FilteredBy';
import { Todo } from './types/Todo';
import { TodoNotification } from './components/TodoNotification';
import { UserWarning } from './UserWarning';

const USER_ID = 6662;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoLoaded, setIsTodoLoaded] = useState(false);
  const [filterBy, setFilterBy] = useState<FilteredBy>(FilteredBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const isActiveTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const countActiveTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setIsTodoLoaded(true);
      setTodos(todosFromServer);
      setIsTodoLoaded(false);
    } catch (error) {
      setIsError(true);
      setIsTodoLoaded(false);
      setErrorMessage('Data couldn\'t be loaded from the server');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const createTodoOnServer = async (query: string) => {
    const data = {
      title: query,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...data,
      id: 0,
    });
    try {
      setIsTodoLoaded(true);
      await createTodo(USER_ID, data);
      await getTodosFromServer();
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsTodoLoaded(false);
    }
  };

  const removeTodoOnServer = async (id: number) => {
    try {
      setIsTodoLoaded(true);
      await deleteTodo(id);
      await getTodosFromServer();
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setIsTodoLoaded(false);
    }
  };

  const updateTodoOnServer = async (todo: Todo, isChange?: boolean) => {
    const todoId = todo.id;
    const todoCopy = {
      ...todo,
    };

    if (isChange) {
      todoCopy.completed = !todo.completed;
    }

    try {
      setIsTodoLoaded(true);
      await updateTodo(todoId, todoCopy);
      getTodosFromServer();
    } catch (error) {
      setIsError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setTempTodo(null);
      setIsTodoLoaded(false);
    }
  };

  const updateAllTodos = async () => {
    todos.forEach(todo => {
      updateTodoOnServer(todo, true);
    });
  };

  const clearCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => removeTodoOnServer(todo.id));
  };

  const visibleTodos: Todo[] = useMemo(() => {
    switch (filterBy) {
      case FilteredBy.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilteredBy.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilteredBy.ALL:
        return [...todos];

      default:
        throw new Error('Unexpected filter type');
    }
  }, [filterBy, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          isTodoLoaded={isTodoLoaded}
          createTodoOnServer={createTodoOnServer}
          setErrorMessage={setErrorMessage}
          setIsError={setIsError}
          isActiveTodos={isActiveTodos}
          updateAllTodos={updateAllTodos}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodoOnServer={removeTodoOnServer}
              updateTodoOnServer={updateTodoOnServer}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              isActiveTodos={isActiveTodos}
              clearCompletedTodo={clearCompletedTodo}
              countActiveTodos={countActiveTodos}
            />
          </>
        )}
      </div>
      {isError && (
        <TodoNotification
          errorMessage={errorMessage}
          setIsError={setIsError}
        />
      )}
    </div>
  );
};
