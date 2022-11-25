import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessages } from './components/ErrorMessages';
import { TodoContent } from './components/TodoContent/TodoContent';

import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';

import { TodosContext } from './context/todosContext';

import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './api/todos';

import { manageErrors } from './utils/manageErrors';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [proccessedTodoIds, setProccessedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showError = useCallback((errorType: ErrorType) => {
    setErrorMessage(manageErrors(errorType));
    setTimeout(() => {
      setErrorMessage(ErrorType.None);
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
      setProccessedTodoIds(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await removeTodo(todoId);
      await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Delete);
    } finally {
      setProccessedTodoIds(currentIds => currentIds.slice(todoId, 1));
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
      setProccessedTodoIds(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await updateTodo(todoId, { completed: !data });
      await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoIds(currentIds => currentIds.slice(todoId, 1));
    }
  }, [todos]);

  const changeTodoTitle = useCallback(async (
    todoId: number,
    data: string,
  ) => {
    try {
      setProccessedTodoIds(currentIds => ([
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
      setProccessedTodoIds(currentIds => currentIds.slice(todoId, 1));
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

  const onChangeTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, [todoTitle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodosContext.Provider value={todos}>
        <TodoContent
          newTodoField={newTodoField}
          onChangeTitle={onChangeTitle}
          todoTitle={todoTitle}
          createNewTodo={createNewTodo}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
          proccessedTodoIds={proccessedTodoIds}
          changeCompleteStatus={changeCompleteStatus}
          deleteAllCompletedTodos={deleteAllCompletedTodos}
          changeTodoTitle={changeTodoTitle}
        />

        <ErrorMessages
          errorMessage={errorMessage}
          manageErrors={manageErrors}
        />
      </TodosContext.Provider>
    </div>
  );
};
