import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { TodosSelection } from './components/TodosSelection/TodosSelection';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import {
  addTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoIdsLoading, setTodoIdsLoading] = useState<number[]>([]);
  const [tempTodoTitle, setTempTodoTitle] = useState('');
  const [
    statusToFilter,
    setStatusToFilter,
  ] = useState<TodosFilter>(TodosFilter.All);

  const tempTodo = useMemo(() => ({
    id: 0,
    userId: 0,
    title: tempTodoTitle,
    completed: false,
  }), [tempTodoTitle]);

  const closeNotification = useCallback(() => setHasError(false), []);

  const filtredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (statusToFilter) {
        case TodosFilter.Active:
          return !completed;

        case TodosFilter.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, statusToFilter]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const generateError = useCallback((message: string) => {
    setErrorMessage(message);
    setHasError(true);
  }, []);

  const getTodosFromServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      generateError('Unable to show todos');
    }
  }, []);

  const addTodoToServer = useCallback(async (todoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);
        setTempTodoTitle(todoTitle);

        await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        await getTodosFromServer();
        setIsAdding(false);
      } catch (error) {
        generateError('Unable to add todo');
        setIsAdding(false);
      }
    }
  }, []);

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await removeTodo(todoId);
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to remove todo ${todoId}`);
    }
  }, []);

  const removeAllCompletedTodos = useCallback(async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      generateError('Unable to remove all completed todo');
    }
  }, [completedTodos]);

  const toggleTodoServerStatus = useCallback(async (
    todoId: number,
    status: boolean,
  ) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await patchTodo(todoId, { completed: status });
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to change status of todo #${todoId}!`);
    }
  }, [todos]);

  const toggleAllTodosServerStatus = useCallback(async () => {
    try {
      const todosToToggleStatus = completedTodos.length !== todos.length
        ? todos.filter(({ completed }) => !completed)
        : todos;

      await Promise.all(todosToToggleStatus.map(({ id, completed }) => (
        toggleTodoServerStatus(id, !completed)
      )));
    } catch (error) {
      generateError('Unable to toggle all todos status!');
    }
  }, [todos]);

  const sendNewTodoTitleToServer = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await patchTodo(todoId, { title: newTitle });
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to change title of todo #${todoId}!`);
    }
  }, []);

  const isSelectionVisible = useMemo(() => (
    todos.length > 0 || isAdding
  ), [todos, isAdding]);

  useEffect(() => {
    setTimeout(() => setHasError(false), 3000);
  }, [hasError]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <TodoForm
          isToggleVisible={todos.length !== 0}
          newTodoField={newTodoField}
          toggleAllTodosServerStatus={toggleAllTodosServerStatus}
          addTodoToServer={addTodoToServer}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          isAllTodosCompleted={completedTodos.length === todos.length}
        />

        <TodoList
          filtredTodos={filtredTodos}
          isAdding={isAdding}
          tempTodo={tempTodo}
          todoIdsLoading={todoIdsLoading}
          removeTodoFromServer={removeTodoFromServer}
          toggleTodoServerStatus={toggleTodoServerStatus}
          sendNewTodoTitleToServer={sendNewTodoTitleToServer}
        />

        {isSelectionVisible && (
          <TodosSelection
            completedTodosLength={completedTodos.length}
            todosLength={todos.length}
            statusToFilter={statusToFilter}
            setStatusToFilter={setStatusToFilter}
            removeAllCompletedTodos={removeAllCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        closeNotification={closeNotification}
      >
        {errorMessage}
      </ErrorNotification>
    </div>
  );
};
