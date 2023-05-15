/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, patchTodo } from './api/todos';
import { ErrorType } from './types/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterConditions';
import { USER_ID } from './constants';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [processing, setProcessing] = useState<number[]>([]);

  const uploadTodos = useCallback(async () => {
    try {
      const uploadedTodos = await getTodos(USER_ID);

      setTodos(uploadedTodos);
    } catch (err) {
      setError(ErrorType.Load);
    }
  }, []);

  useEffect(() => {
    uploadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return [...todos];
    }
  }, [todos, filter]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setProcessing(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setProcessing(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const updateTodo = useCallback(async (
    todoId: number, updatedData: Partial<Todo>,
  ) => {
    try {
      setProcessing(prevState => [...prevState, todoId]);

      await patchTodo(todoId, updatedData);

      setTodos(prevState => prevState.map(
        prevTodo => {
          if (prevTodo.id !== todoId) {
            return prevTodo;
          }

          return { ...prevTodo, ...updatedData };
        },
      ));
    } catch {
      setError(ErrorType.Update);
    } finally {
      setProcessing(prevState => prevState.filter(item => item !== todoId));
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => setError(ErrorType.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  const handleErrorNotification = () => {
    setError(ErrorType.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          preparedTodos={filteredTodos}
          onUpdateTodo={updateTodo}
          onChangeTempTodo={setTempTodo}
          onChangeTodos={setTodos}
          onChangeError={setError}
          onChangeProcessing={setProcessing}
        />

        <TodoList
          preparedTodos={filteredTodos}
          tempTodo={tempTodo}
          processing={processing}
          error={error}
          onRemoveTodo={removeTodo}
          onUpdateTodo={updateTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onRemoveTodo={removeTodo}
            onChangeFilter={setFilter}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === ErrorType.None,
        },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleErrorNotification}
        />
        {error}
      </div>
    </div>
  );
};
