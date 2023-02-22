import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
  closeErrorNotification,
  prepareTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorsNotification } from './components/ErrorsNotification';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { ErrorType } from './types/ErrorType';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const USER_ID = 6391;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Filter>(Filter.ALL);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState<boolean>(true);
  const [todosIdInProcess, setTodosIdInProcess] = useState<number[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  const changeHasError = (isError: boolean) => {
    setHasError(isError);
  };

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const changeStatus = (todoStatus: Filter) => {
    setStatus(todoStatus);
  };

  const showError = (error: ErrorType) => {
    setHasError(true);
    setErrorType(error);
    closeErrorNotification(setHasError);
  };

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      showError(ErrorType.LOAD);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    prepareTodo(todos, status)
  ), [todos, status]);

  const onAddTodo = async (todoTitle: string) => {
    if (todoTitle.length === 0) {
      showError(ErrorType.EMPTY_TITLE);
    } else {
      const todoToAdd = {
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      };

      try {
        setIsInputEnabled(false);
        setTitle('');

        const newTodo = await addTodo(USER_ID, todoToAdd);

        setTempTodo(newTodo);

        try {
          const todosFromServer = await getTodos(USER_ID);

          setTodos(todosFromServer);
        } catch (error) {
          showError(ErrorType.LOAD);
        }
      } catch {
        showError(ErrorType.ADD);
      } finally {
        setTempTodo(null);
        setIsInputEnabled(true);
      }
    }
  };

  const removeTodo = async (removingTodo: Todo) => {
    try {
      setTodosIdInProcess(currentId => [...currentId, removingTodo.id]);
      await deleteTodo(removingTodo.id);

      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== removingTodo.id)
      ));
    } catch {
      showError(ErrorType.DELETE);
    } finally {
      setTodosIdInProcess([]);
    }
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo);
      }
    });
  };

  const updateTitleOfTodo = async (updatingTodo: Todo, newTitle: string) => {
    try {
      setTodosIdInProcess(currentId => [...currentId, updatingTodo.id]);

      const updatedTodo: Todo = await updateTodoTitle(
        USER_ID,
        updatingTodo.id,
        newTitle,
      );

      setTodos(currentTodos => {
        return currentTodos.map(todo => (
          todo.id === updatingTodo.id
            ? updatedTodo
            : todo
        ));
      });
    } catch {
      showError(ErrorType.UPDATE);
    } finally {
      setTodosIdInProcess([]);
    }
  };

  const updateStatusOfTodo = async (updatingTodo: Todo) => {
    const newStatus = !updatingTodo.completed;

    try {
      setTodosIdInProcess(currentId => [...currentId, updatingTodo.id]);

      const updatedTodo: Todo = await updateTodoStatus(
        USER_ID,
        updatingTodo.id,
        newStatus,
      );

      setTodos(currentTodos => (
        currentTodos.map(todo => (
          todo.id === updatingTodo.id
            ? updatedTodo
            : todo
        ))
      ));
    } catch {
      showError(ErrorType.UPDATE);
    } finally {
      setTodosIdInProcess([]);
    }
  };

  const updateAllTodosStatus = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUdape = todos
      .filter(todo => todo.completed !== !isAllCompleted);

    todosToUdape.forEach(todo => {
      updateStatusOfTodo(todo);
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
          isInputEnabled={isInputEnabled}
          title={title}
          onTitleChange={changeTitle}
          onAddTodo={onAddTodo}
          onUpdateAllTodosStatus={updateAllTodosStatus}
          todos={todos}
          showError={showError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={removeTodo}
              onUpdateTodoStatus={updateStatusOfTodo}
              todosIdInProcess={todosIdInProcess}
              onUpdateTodoTitle={updateTitleOfTodo}
            />
            <Footer
              todos={todos}
              filterBy={status}
              onFilterBy={changeStatus}
              onDeleteCopletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorsNotification
        hasError={hasError}
        errorType={errorType}
        onHasError={changeHasError}
      />
    </div>
  );
};
