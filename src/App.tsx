import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header/Header';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoFilterOptions } from './types/TodoFiltersOptions';

export const App: React.FC = () => {
  //#region State Management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [todoFilterValue, setTodoFilterValue] = useState<TodoFilterOptions>(
    TodoFilterOptions.All,
  );
  //#endregion

  //#region Fetch Todos
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);
  //#endregion

  //#region Error Handling Timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);
  //#endregion

  //#region Filters
  const filterTodos = useCallback(
    (todosForFilter: Todo[], statusFilterValue: TodoFilterOptions) => {
      return todosForFilter.filter(todo => {
        switch (statusFilterValue) {
          case TodoFilterOptions.Active:
            return !todo.completed;
          case TodoFilterOptions.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
    },
    [],
  );

  const filteredTodos = useMemo(
    () => filterTodos(todos, todoFilterValue),
    [filterTodos, todos, todoFilterValue],
  );

  const uncompletedTodos = useMemo(() => {
    const uncompletedTodosArr = todos.filter(todo => !todo.completed);

    return uncompletedTodosArr;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  //#endregion

  //#region Add Todo
  const addTodo = useCallback(async (title: string) => {
    const newTodoTitle = title.trim();

    if (!newTodoTitle) {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const response = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, response]);
      setError('');
    } catch (err) {
      setError('Unable to add a todo');
      throw err;
    } finally {
      setTempTodo(null);
    }
  }, []);
  //#endregion

  //#region Update Todo
  const updateTodo = useCallback((todoId: number, data: Partial<Todo>) => {
    return patchTodo(todoId, data)
      .then((response: Todo) => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map((todo: Todo) =>
            todo.id === response.id ? response : todo,
          ),
        );
      })
      .catch(err => {
        setError('Unable to update a todo');

        return Promise.reject(err);
      });
  }, []);
  //#endregion

  //#region Toggle All Todos
  const toggleAllTodos = useCallback(async () => {
    if (!todos.length) {
      return;
    }

    const toggleValue = !!uncompletedTodos.length;

    const updatedTodos = todos.map(todo =>
      todo.completed !== toggleValue ? { ...todo, loading: true } : todo,
    );

    setTodos(updatedTodos);

    try {
      const todosToToggle = todos.filter(
        todo => todo.completed !== toggleValue,
      );
      const results = await Promise.allSettled(
        todosToToggle.map(todo =>
          updateTodo(todo.id, { completed: toggleValue }),
        ),
      );

      const rejectedTodos = results.filter(
        result => result.status === 'rejected',
      );

      if (rejectedTodos.length) {
        setError('Some todos could not be updated');
      }

      setTodos(prevTodos =>
        prevTodos.map(todo => ({
          ...todo,
          completed:
            todo.completed !== toggleValue ? toggleValue : todo.completed,
          loading: false,
        })),
      );
    } catch {
      setError('Error updating todos');
      setTodos(prevTodos =>
        prevTodos.map(todo => ({ ...todo, loading: false })),
      );
    }
  }, [todos, uncompletedTodos, updateTodo]);
  //#endregion

  //#region Remove Todo
  const removeTodo = useCallback((todoId: Pick<Todo, 'id'> | number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setError('');
      })
      .catch(err => {
        setError('Unable to delete a todo');

        return Promise.reject(err);
      });
  }, []);
  //#endregion

  //#region Remove All Completed Todos
  const removeCompletedTodos = useCallback(async () => {
    if (!completedTodos.length) {
      return;
    }

    const results = await Promise.allSettled(
      completedTodos.map(todo => removeTodo(todo.id)),
    );

    const rejectedTodos = results.filter(
      result => result.status === 'rejected',
    );

    if (rejectedTodos.length) {
      setError('Some todos could not be deleted');
    }
  }, [completedTodos, removeTodo]);
  //#endregion

  //#region JSX Return
  return (
    <>
      {USER_ID ? (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              addTodo={addTodo}
              areAllTodosCompleted={uncompletedTodos.length === 0}
              isTodos={!!todos.length}
              toggleTodos={toggleAllTodos}
            />

            {(!!todos.length || tempTodo) && (
              <>
                <TodoList
                  todos={filteredTodos}
                  tempTodo={tempTodo}
                  deleteTodo={removeTodo}
                  updateTodo={updateTodo}
                />
                <Footer
                  activeTodoFilter={todoFilterValue}
                  setTodoFilterValue={setTodoFilterValue}
                  uncompletedTodosCount={uncompletedTodos.length}
                  completedTodosCount={completedTodos.length}
                  clearCompletedTodos={removeCompletedTodos}
                />
              </>
            )}
          </div>

          <ErrorNotification errorMessage={error} setErrorMessage={setError} />
        </div>
      ) : (
        <UserWarning />
      )}
    </>
  );
  //#endregion
};
