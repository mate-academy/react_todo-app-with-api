import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessages } from './components/ErrorMessages';
import { TodoContent } from './components/TodoContent/TodoContent';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';

import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [proccessedTodoId, setProccessedTodoId] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEveryTodosComplited = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const countOfTodos = useMemo(() => todos.length, [todos]);

  const countOfLeftTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasComplited = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const manageErrors = useCallback((errorType: ErrorType) => {
    setErrorMessage(() => {
      switch (errorType) {
        case ErrorType.Endpoint:
          return 'Fetch error';

        case ErrorType.Title:
          return 'Title can`t be empty';

        case ErrorType.Add:
          return 'Unable to add a todo';

        case ErrorType.Delete:
          return 'Unable to delete a todo';

        case ErrorType.Update:
          return 'Unable to update a todo';

        case ErrorType.None:
        default:
          return '';
      }
    });
  }, []);

  const showError = useCallback((errorType: ErrorType) => {
    manageErrors(errorType);
    setTimeout(() => {
      manageErrors(ErrorType.None);
    }, 3000);
  }, []);

  const getTodosFromServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      showError(ErrorType.Endpoint);
    }
  }, []);

  const createNewTodo = useCallback(async (title: string) => {
    try {
      if (!title) {
        showError(ErrorType.Title);
      }

      if (title && user) {
        setIsLoading(true);

        await createTodo(title, user.id);
        await getTodosFromServer();
      }
    } catch (error) {
      showError(ErrorType.Add);
    } finally {
      setTodoTitle('');
      setIsLoading(false);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await removeTodo(todoId);
      await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Delete);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  }, [todos]);

  const deleteAllCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const changeCompleteStatus = useCallback(async (
    todoId: number,
    data: boolean,
  ) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await updateTodo(todoId, { completed: !data });
      await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  }, [todos]);

  const copleteAllTodos = useCallback(() => {
    todos.forEach(todo => {
      if (!todo.completed) {
        changeCompleteStatus(todo.id, todo.completed);
      }

      if (isEveryTodosComplited) {
        changeCompleteStatus(todo.id, todo.completed);
      }
    });
  }, [todos]);

  const changeTodoTitle = useCallback(async (
    todoId: number,
    data: string,
  ) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await updateTodo(todoId, { title: data });
      await getTodosFromServer();

      if (data === '') {
        deleteTodo(todoId);
      }
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  }, [todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const filterTodos = (filterBy: FilterStatus) => {
    setFilterStatus(filterBy);

    return todos.filter(todo => {
      switch (filterBy) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  };

  const filteredTodos = useMemo(() => (
    filterTodos(filterStatus)
  ), [filterStatus, todos]);

  const onChangeTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, [todoTitle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={todos}
        countOfTodos={countOfTodos}
        countOfLeftTodos={countOfLeftTodos}
        hasComplited={hasComplited}
        visibleTodos={filteredTodos}
        newTodoField={newTodoField}
        filterTodos={filterTodos}
        filterStatus={filterStatus}
        onChangeTitle={onChangeTitle}
        todoTitle={todoTitle}
        createNewTodo={createNewTodo}
        isLoading={isLoading}
        deleteTodo={deleteTodo}
        proccessedTodoId={proccessedTodoId}
        changeCompleteStatus={changeCompleteStatus}
        deleteAllCompletedTodos={deleteAllCompletedTodos}
        copleteAllTodos={copleteAllTodos}
        isEveryTodosComplited={isEveryTodosComplited}
        changeTodoTitle={changeTodoTitle}
      />

      <ErrorMessages
        errorMessage={errorMessage}
        manageErrors={manageErrors}
      />
    </div>
  );
};
