import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './constants';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorType } from './types/Error';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [processing, setProcessing] = useState<number[]>([]);

  const filterTodos = useCallback(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ALL:
      default:
        return [...todos];
    }
  }, [filter, todos]);

  const filteredTodos = useMemo(() => filterTodos(),
    [filter, todos, filterTodos]);

  const removeTodo = async (todoId: number) => {
    try {
      setProcessing(prevState => [...prevState, todoId]);
      await deleteTodo(todoId);
      setTodos(prevState => prevState.filter(item => item.id !== todoId));
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setProcessing(
        prevState => prevState.filter(item => item !== todoId),
      );
    }
  };

  const changeTodo = async (
    todoId: number, updatedData: Partial<Todo>,
  ) => {
    try {
      setProcessing(prevState => [...prevState, todoId]);
      await updateTodo(todoId, updatedData);
      setTodos(prevState => prevState.map(
        prevTodo => {
          if (prevTodo.id !== todoId) {
            return prevTodo;
          }

          return { ...prevTodo, ...updatedData };
        },
      ));
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessing(
        prevState => prevState.filter(item => item !== todoId),
      );
    }
  };

  useEffect(() => {
    const uploadTodos = async () => {
      try {
        const uploadedTodos = await getTodos(USER_ID);

        setTodos(uploadedTodos);
      } catch {
        setError(ErrorType.LOAD);
      }
    };

    uploadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__con
      tent">

        <Header
          todos={todos}
          changeTodo={changeTodo}
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          setProcessing={setProcessing}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          error={error}
          processing={processing}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            removeTodo={removeTodo}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorMessage error={error} setError={setError} />
    </div>
  );
};
