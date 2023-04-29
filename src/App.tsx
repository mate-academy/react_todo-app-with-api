import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, patchTodo } from './api/todos';
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
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

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

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingTodoIds(prevState => [...prevState, todoId]);
      await deleteTodo(todoId);
      setTodos(prevState => prevState.filter(item => item.id !== todoId));
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setProcessingTodoIds(
        prevState => prevState.filter(item => item !== todoId),
      );
    }
  }, [deleteTodo]);

  const updateTodo = useCallback(async (
    todoId: number, updatedData: Partial<Todo>,
  ) => {
    try {
      setProcessingTodoIds(prevState => [...prevState, todoId]);
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
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingTodoIds(
        prevState => prevState.filter(item => item !== todoId),
      );
    }
  }, [patchTodo]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch {
        setError(ErrorType.LOAD);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__con
      tent"
      >

        <Header
          todos={todos}
          updateTodo={updateTodo}
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          setProcessingTodoIds={setProcessingTodoIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          error={error}
          processingTodoIds={processingTodoIds}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
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
