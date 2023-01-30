/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { filteredTodosFunction } from './components/Helpers/FilteredTodos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [status, setStatus] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [isTodoUpdating, setIsTodoUpdating] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setHasError(true);
          setErrorMessage(ErrorMessage.DownloadError);
        });
    }
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const comletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const filteredTodos = useMemo(() => (
    filteredTodosFunction(todos, status)
  ), [todos, status]);

  if (hasError) {
    setTimeout(() => setHasError(false), 3000);
  }

  const createTodo = useCallback(async (newTitle: string) => {
    setIsTodoAdding(true);

    if (user) {
      try {
        const newTodo = await addTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(currentTodos => [
          ...currentTodos, newTodo,
        ]);
        setErrorMessage('');
        setHasError(false);
      } catch (error) {
        setErrorMessage(ErrorMessage.AddTodoError);
        setHasError(true);
      } finally {
        setIsTodoAdding(false);
      }
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));

      setErrorMessage('');
      setHasError(false);
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodoError);
      setHasError(true);
    }
  }, []);

  const clearTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  const changeTodo = useCallback(async (
    id: number,
    itemsToUpdate: Partial<Todo>,
  ) => {
    try {
      setErrorMessage('');
      await updateTodo(id, itemsToUpdate);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === id
          ? { ...todo, ...itemsToUpdate }
          : todo
      )));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodoError);
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAllTodos = async (
    id: number,
    itemsToUpdate: Partial<Todo>,
  ) => {
    setIsTodoUpdating(true);
    await changeTodo(id, itemsToUpdate);
    setIsTodoUpdating(false);
  };

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        toggleAllTodos(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setErrorMessage={setErrorMessage}
          createTodo={createTodo}
          setHasError={setHasError}
          isTodoAdding={isTodoAdding}
          changeAllTodos={changeAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              newTodoField={newTodoField}
              todos={filteredTodos}
              removeTodo={removeTodo}
              setErrorMessage={setErrorMessage}
              changeTodo={changeTodo}
              isTodoUpdating={isTodoUpdating}
            />
            <Footer
              activeTodos={activeTodos}
              comletedTodos={comletedTodos}
              status={status}
              setStatus={setStatus}
              clearTodos={clearTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
