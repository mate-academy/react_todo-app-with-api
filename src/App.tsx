/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';
import { Status } from './types/StatusEnum';
import { TodoMain } from './components/TodoMain';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoFooter } from './components/TodoFooter';
import { ErrorType } from './types/ErrorEnum';
import { TodoUpdate } from './types/TodoUpdate';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const [status, setStatus] = useState(Status.All);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [todoToLoadIds, setTodoToLoadIds] = useState<Todo['id'][]>([]);

  const activeTodos = todos.filter(todo => todo.completed === false);
  const isOneCompleted = todos.every(todo => todo.completed === false);

  useEffect(() => {
    setIsLoading(true);

    const loadData = async () => {
      try {
        const loadedData = await getTodos();

        setTodos(loadedData);
      } catch (error) {
        setErrorType(ErrorType.Load);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (errorType !== null) {
      const timer = setTimeout(() => {
        setErrorType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorType]);

  const todoInput = useRef<HTMLInputElement>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getPreparedTodos = (todosToPrepare: Todo[], settedStatus: Status) => {
    let preparedTodos = [...todosToPrepare];

    if (settedStatus !== Status.All) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (settedStatus) {
          case Status.Active:
            return !todo.completed;

          case Status.Completed:
            return todo.completed;

          default:
            return new Error('unknown Status has been selected!');
        }
      });
    }

    return preparedTodos;
  };

  const handleSwitchStatus = (selectedStatus: Status) => {
    setStatus(selectedStatus);
  };

  const handleCloseError = () => {
    setErrorType(null);
    todoInput.current?.focus();
  };

  const handleChangeInput = (value: string) => {
    setInputText(value);
  };

  const handleAddTodo = async (newTodoTitle: string) => {
    setErrorType(null);
    setIsLoadingTodo(true);

    if (newTodoTitle === '') {
      setErrorType(ErrorType.EmptyTitle);
      setIsLoadingTodo(false);

      todoInput.current?.focus();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: newTodoTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: newTodoTitle.trim(),
      userId: 3635,
      completed: false,
    });

    try {
      await addTodo(newTodo);

      newTodo.id = Date.now();

      setTodos(prevTodos => [...prevTodos, newTodo]);

      setInputText('');
    } catch (error) {
      setErrorType(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setIsLoadingTodo(false);
      setTimeout(() => {
        todoInput.current?.focus();
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    setTodoToLoadIds(currentIds => [...currentIds, todoId]);
    setIsDeleteLoading(true);
    setErrorType(null);

    try {
      await deleteTodo(todoId);

      setTodos(currTodo => currTodo.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorType(ErrorType.Delete);
    } finally {
      // setLoadingTodo(false);
      setIsDeleteLoading(false);
      todoInput.current?.focus();
      setTodoToLoadIds([]);
    }
  };

  const deleteAllCopletedTodo = async () => {
    setErrorType(null);
    setIsDeleteLoading(true);

    const completedTodos = todos
      .filter(todo => todo.completed === true)
      .map(todo => todo.id);

    setTodoToLoadIds(completedTodos);

    try {
      const deletionPromises = completedTodos.map(id => deleteTodo(id));

      const result = await Promise.allSettled(deletionPromises);

      const failedDeletion = result.some(
        deletion => deletion.status === 'rejected',
      );

      if (failedDeletion) {
        setErrorType(ErrorType.Delete);
      }

      setTodos(prevTodos => [
        ...prevTodos.filter(todo => todo.completed === false),
      ]);

      todoInput.current?.focus();
    } catch (error) {
      setErrorType(ErrorType.Delete);
      throw new Error('Unable to delete todo');
    } finally {
      setIsDeleteLoading(false);
      setTodoToLoadIds([]);
    }
  };

  const handleDeleteCompletedTodos = () => {
    deleteAllCopletedTodo();
  };

  const handleUpdateTodo = async (
    todoToUpdate: Todo['id'],
    body: TodoUpdate,
    onSuccess: (updatedTodo: Todo) => void = () => {},
    onError: () => void = () => {},
  ) => {
    setErrorType(null);
    setTodoToLoadIds(currentIds => [...currentIds, todoToUpdate]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate, body);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          return todo.id === todoToUpdate ? updatedTodo : todo;
        }),
      );

      onSuccess?.(updatedTodo);
    } catch (error) {
      setErrorType(ErrorType.Update);

      onError?.();
    } finally {
      setIsLoadingTodo(false);
      setTodoToLoadIds([]);
    }
  };

  const handleBulkToggleStatus = () => {
    if (activeTodos.length) {
      activeTodos.forEach(({ id: todoId, ...todoBody }) => {
        handleUpdateTodo(todoId, { ...todoBody, completed: true });
      });
    } else {
      todos.forEach(({ id: todoId, ...todoBody }) => {
        handleUpdateTodo(todoId, { ...todoBody, completed: false });
      });
    }
  };

  const visibleTodos: Todo[] = getPreparedTodos(todos, status);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          inputValue={inputText}
          onChangeInput={handleChangeInput}
          onAddTodo={handleAddTodo}
          loading={isLoadingTodo}
          ref={todoInput}
          onBulkToggleStatus={handleBulkToggleStatus}
        />
        <TodoMain
          visibleTodos={visibleTodos}
          isLoading={isLoading}
          deleteLoading={isDeleteLoading}
          loadTodoIds={todoToLoadIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <TodoFooter
            status={status}
            completed={todos}
            activeTodos={activeTodos}
            isOneCompletedTodo={isOneCompleted}
            onSwitch={handleSwitchStatus}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage errorToShow={errorType} onCloseBtn={handleCloseError} />
    </div>
  );
};
