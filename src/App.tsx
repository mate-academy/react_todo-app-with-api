/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  patchTodo,
  postTodo,
  removeTodo,
} from './api/todos';
import { TodosFilter } from './types/TodosFilter';
import { Header } from './components/Header/Header';
import {
  ErrorNotifications,
} from './components/ErrorNotifications/ErrorNotifications';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { UpdateTodoArgs } from './types/UpdateTodoArgs';
import { filterTodos } from './helpers';

const USER_ID = 10911;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [
    selectFilter,
    setSelectFilter,
  ] = useState<TodosFilter>(TodosFilter.ALL);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState([0]);

  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const isTodos = todos.length > 0;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((err) => {
        setError(err.message || 'Smth went wrong!');
      });
  }, []);

  const addTodo = useCallback((title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: 10911,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });
    setIsLoading(true);

    return postTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTempTodo(null);
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
        setIsLoading(false);
      })
      .catch(() => setError('Unable to add a todo'));
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setCompletedIds((prev) => [...prev, todoId]);

    return removeTodo(todoId)
      .then(response => {
        const isDeleted = Boolean(response);

        if (isDeleted) {
          setCompletedIds((prev) => [...prev, todoId]);
          setTodos(
            (prevTodos) => prevTodos.filter(todo => todo.id !== todoId),
          );
        }
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setCompletedIds([0]));
  }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    data: UpdateTodoArgs,
  ) => {
    setLoadingIds((prevIds) => [...prevIds, todoId]);
    try {
      const updatedTodo = await patchTodo(todoId, data);

      setTodos((prevTodos) => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }) as Todo[]);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, selectFilter);
  }, [selectFilter, todos]);

  const deleteCompleteTodoIds = useCallback(() => {
    const filteredTodos = todos.filter(item => item.completed);

    filteredTodos.forEach(item => deleteTodo(item.id));
  }, [todos]);

  const toggleAllHandler = () => {
    const isEvenOneCompleted = todos.some(todo => todo.completed);

    if (isEvenOneCompleted && !isAllTodosCompleted) {
      todos.forEach(async (todo) => {
        if (!todo.completed) {
          await updateTodo(
            todo.id,
            { completed: !isAllTodosCompleted },
          );
        }
      });
    } else {
      todos.forEach(async (todo) => {
        await updateTodo(
          todo.id,
          { completed: !isAllTodosCompleted },
        );
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          onError={setError}
          toggleAll={toggleAllHandler}
          todos={todos}
        />

        {isTodos && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              completedIds={completedIds}
              isLoading={isLoading}
              updateTodo={updateTodo}
              loadingIds={loadingIds}
            />

            <Footer
              selectFilter={selectFilter}
              onSelectFilter={setSelectFilter}
              todos={todos}
              completeTodoIds={deleteCompleteTodoIds}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorNotifications
          error={error}
          onError={setError}
        />
      )}
    </div>
  );
};
