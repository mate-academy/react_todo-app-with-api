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
  editCompleteTodoStatus,
  changeTitle,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [proccessedTodoId, setProccessedTodoId] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEveryTodosComplited = todos.every(todo => todo.completed);

  const [filterStatus, setFilterStatus]
    = useState<FilterStatus>(FilterStatus.All);

  const manageErrors = useCallback((errorType: ErrorType) => {
    setErrorMessage(currentMessage => {
      let newMessage = currentMessage;

      switch (errorType) {
        case ErrorType.Endpoint:
          newMessage = 'Fetch error';
          break;

        case ErrorType.Title:
          newMessage = 'Title can`t be empty';
          break;

        case ErrorType.Add:
          newMessage = 'Unable to add a todo';
          break;

        case ErrorType.Delete:
          newMessage = 'Unable to delete a todo';
          break;

        case ErrorType.Update:
          newMessage = 'Unable to update a todo';
          break;

        case ErrorType.None:
        default:
          newMessage = '';
      }

      return newMessage;
    });
  }, []);

  const showError = useCallback((errorType: ErrorType) => {
    manageErrors(errorType);
    setTimeout(() => {
      manageErrors(ErrorType.None);
    }, 3000);
  }, []);

  const onCompleteTodo = useCallback((todoId: number) => {
    setTodos(currentTodos => (
      currentTodos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      })
    ));
  }, [todos]);

  const onChangeTodoTitle = useCallback((todoId: number, newTitle: string) => {
    setTodos(currentTodos => (
      currentTodos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            title: newTitle,
          };
        }

        return todo;
      })
    ));
  }, [todos]);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      showError(ErrorType.Endpoint);
    }
  };

  const createNewTodo = async (title: string) => {
    try {
      if (!title) {
        showError(ErrorType.Title);
      }

      if (title && user) {
        setIsLoading(true);

        const newTodo = await createTodo(title, user.id);

        setTodos(currentTodos => ([
          ...currentTodos,
          newTodo,
        ]));

        setTodoTitle('');
      }
    } catch (error) {
      showError(ErrorType.Add);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await removeTodo(todoId);

      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoId)
      ));
    } catch (error) {
      showError(ErrorType.Delete);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  };

  const deleteAllCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const changeCompleteStatus = async (todoId: number, isComplited: boolean) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await editCompleteTodoStatus(todoId, !isComplited);
      onCompleteTodo(todoId);
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  };

  const copleteAllTodos = () => {
    todos.forEach(todo => {
      if (!todo.completed) {
        changeCompleteStatus(todo.id, todo.completed);
      }

      if (isEveryTodosComplited) {
        changeCompleteStatus(todo.id, !todo.completed);
      }
    });
  };

  const changeTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      setProccessedTodoId(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await changeTitle(todoId, newTitle);

      if (newTitle === '') {
        deleteTodo(todoId);
      }

      onChangeTodoTitle(todoId, newTitle);
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoId(currentIds => currentIds.slice(todoId, 1));
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const filterTodos = (filterBy: FilterStatus) => {
    const filteredByStatus = todos.filter(todo => {
      switch (filterBy) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });

    setFilterStatus(filterBy);

    return filteredByStatus;
  };

  const filteredTodos = useMemo(() => (
    filterTodos(filterStatus)
  ), [filterStatus, todos]);

  const onChangeTitle = (title: string) => {
    setTodoTitle(title);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={todos}
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
