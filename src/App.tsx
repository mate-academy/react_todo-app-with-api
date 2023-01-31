import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodosSelection } from './components/TodosSelection';

import { Todo } from './types/Todo';
import { TodosStatus } from './types/TodosStatus';
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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosStatus, setTodosStatus] = useState<TodosStatus>(TodosStatus.All);
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsLoading, setTodoIdsLoading] = useState<number[]>([]);
  const [tempTodoTitle, setTempTodoTitle] = useState('');

  const tempTodo = useMemo(() => ({
    id: 0,
    userId: 0,
    title: tempTodoTitle,
    completed: false,
  }), [tempTodoTitle]);

  const filteredTodos = useMemo(() => (
    todos.filter((todo) => {
      switch (todosStatus) {
        case TodosStatus.Active:
          return !todo.completed;

        case TodosStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    })
  ), [todos, todosStatus]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const closeNotification = useCallback(() => (
    setHasError(false)
  ), []);

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
      generateError('Unable to show todos!');
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
        generateError('Unable to add a todo!');
        setIsAdding(false);
      }
    }
  }, []);

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setTodoIdsLoading((currentIds) => [...currentIds, todoId]);

      await removeTodo(todoId);
      await getTodosFromServer();

      setTodoIdsLoading((currentIds) => (
        currentIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to remove todo with id #${todoId}!`);
    }
  }, []);

  const removeAllCompletedTodos = useCallback(async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      generateError('Unable to remove all completed todos!');
    }
  }, [completedTodos]);

  const toggleTodoStatusOnServer = useCallback(async (
    todoId: number,
    status: boolean,
  ) => {
    try {
      setTodoIdsLoading((currentIds) => [...currentIds, todoId]);

      await patchTodo(todoId, { completed: status });
      await getTodosFromServer();

      setTodoIdsLoading((currentIds) => (
        currentIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to update the status of todo with id #${todoId}!`);
    }
  }, [todos]);

  const toggleAllTodosStatusOnServer = useCallback(async () => {
    try {
      const todosToToggleStatus = completedTodos.length !== todos.length
        ? todos.filter(({ completed }) => !completed)
        : todos;

      await Promise.all(todosToToggleStatus.map(({ id, completed }) => (
        toggleTodoStatusOnServer(id, !completed)
      )));
    } catch (error) {
      generateError('Unable to toggle all todos status!');
    }
  }, [todos]);

  const changeTodoTitleOnServer = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    try {
      setTodoIdsLoading((currentIds) => [...currentIds, todoId]);

      await patchTodo(todoId, { title: newTitle });
      await getTodosFromServer();

      setTodoIdsLoading((currentIds) => (
        currentIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      generateError(`Unable to change the title of todo with id #${todoId}!`);
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
          newTodoField={newTodoField}
          isAdding={isAdding}
          generateError={generateError}
          addTodoToServer={addTodoToServer}
          toggleAllTodosStatusOnServer={toggleAllTodosStatusOnServer}
        />

        <TodoList
          filteredTodos={filteredTodos}
          isAdding={isAdding}
          tempTodo={tempTodo}
          todoIdsLoading={todoIdsLoading}
          removeTodoFromServer={removeTodoFromServer}
          toggleTodoStatusOnServer={toggleTodoStatusOnServer}
          changeTodoTitleOnServer={changeTodoTitleOnServer}
        />

        {isSelectionVisible && (
          <TodosSelection
            todosStatus={todosStatus}
            setTodosStatus={setTodosStatus}
            todosLength={todos.length}
            completedTodosLength={completedTodos.length}
            removeAllCompletedTodos={removeAllCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        errorMessage={errorMessage}
        closeNotification={closeNotification}
      />
    </div>
  );
};
