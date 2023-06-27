/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { NewTodo } from './components/NewTodo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';
import { TempTodo } from './types/typeDefs';

const USER_ID = 10358;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setHasError(ErrorType.Load);
      setTimeout(() => setHasError(ErrorType.Load), 3000);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const isCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.Completed:
        return todo.completed;

      case Filter.Active:
        return !todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });

  const makeTodo = useCallback(async (title: string) => {
    setIsLoading(true);
    setHasError('');

    if (title.trim() === '') {
      setHasError(ErrorType.Title);

      return;
    }

    try {
      const newTodo: TempTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });
      const addedTodo = await addTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, addedTodo]);
    } catch {
      setHasError(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setHasError('');
    try {
      await removeTodo(todoId);
      setTodos((currentTodos) => (
        currentTodos.filter(todo => todo.id !== todoId)
      ));
    } catch {
      setHasError(ErrorType.Delete);
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    const todoIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    todoIds.forEach(todoId => deleteTodo(todoId));
  }, [todos]);

  const toggleAll = useCallback(async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllCompleted,
    }));

    setTodos(updatedTodos);
  }, [todos]);

  const changeCompleted = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    setIsLoading(true);

    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    try {
      await updateTodo(todoId, { completed });
      setTodos(updatedTodos);
    } catch {
      setHasError(ErrorType.Update);
    } finally {
      setIsLoading(false);
    }
  }, [todos]);

  const handleUpdateTitle = useCallback(async (
    todoId: number,
    title: string,
  ) => {
    setHasError('');
    setIsLoading(true);

    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          title,
        };
      }

      return todo;
    });

    if (title.trim() === '') {
      setHasError(ErrorType.Title);
      deleteTodo(todoId);
    }

    try {
      await updateTodo(todoId, { title });
      setTodos(updatedTodos);
    } catch {
      setHasError(ErrorType.Update);
    } finally {
      setIsLoading(false);
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          { todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                hidden: !todos.length,
                active: !activeCount,
              })}
              onClick={toggleAll}
            />
          )}

          <NewTodo
            makeTodo={makeTodo}
            isLoading={isLoading}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              onChangeCompleted={changeCompleted}
              onUpdateTitle={handleUpdateTitle}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              activeCount={activeCount}
              isCompleted={isCompleted}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !hasError,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setHasError('')}
        />
        {hasError}
      </div>
    </div>
  );
};
