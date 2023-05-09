import React, {useCallback, useEffect, useState} from 'react';
import classNames from 'classnames';
import {Todo} from './types/Todo';
import {Category} from './utils/Category';
import {Error} from './utils/Error';
import {UserWarning} from './UserWarning';
import {TodoForm} from './Components/TodoForm';
import {TodoList} from './Components/TodoList';
import {TodoFilter} from './Components/TodoFilter';
import {addTodo, getTodos, removeTodo, updateTodoCompleted,} from './api/todos';

const USER_ID = 10156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoError, setTodoError] = useState<Error | null>(null);
  const [filterCategory, setFilterCategory] = useState(Category.All);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [updatingTodos, setUpdatingTodos] = useState<Set<number>>(new Set());
  const hasTodos = todos.length > 0;
  const todosAmount = todos.filter(todo => !todo.completed).length;

  const addUpdatedTodos = useCallback((todoId: number) => {
    setUpdatingTodos(state => {
      state.add(todoId);

      return new Set(state);
    });
  }, []);

  const removeUpdatedTodo = useCallback((todoId: number) => {
    setUpdatingTodos(state => {
      state.delete(todoId);

      return new Set(state);
    });
  }, []);

  const isUpdatingTodo = (todoId: number) => {
    return updatingTodos.has(todoId);
  };

  const handleError = useCallback((error: Error) => {
    setTodoError(error);
  }, []);

  useEffect(() => {
    let timerId: number | null = null;

    if (todoError) {
      timerId = window.setTimeout(() => {
        setTodoError(null);
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [todoError]);

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError(Error.LOAD);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!todoTitle) {
      handleError(Error.TITLE);
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);
      const todo: Todo = {
        title: todoTitle,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      const tempTodo = await addTodo(todo);

      setTodos([
        ...todos,
        tempTodo,
      ]);

      setTodoTitle('');
    } catch {
      handleError(Error.ADD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await removeTodo(todoId);
      const filteredTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
    }
  };

  const handleTodoUpdateCompleted = useCallback(async (todoId: number) => {
    try {
      addUpdatedTodos(todoId);
      const foundTodo = todos.find(todo => todo.id === todoId);

      await updateTodoCompleted(todoId, !foundTodo?.completed);
      setTodos(prevTodos => {
        return (
          prevTodos.map(todo => {
            if (foundTodo?.id === todo.id) {
              foundTodo.completed = !foundTodo.completed;

              return foundTodo;
            }

            return todo;
          })
        );
      });
    } catch {
      handleError(Error.UPDATE);
    } finally {
      removeUpdatedTodo(todoId);
    }
  }, [todos, updatingTodos]);

  const handleAllTodoCompleted = async () => {
    try {
      const hasActive = todos.some(todo => !todo.completed);

      const updatedTodos = await Promise.all(
        todos.map(async todo => {
          if (hasActive && !todo.completed) {
            addUpdatedTodos(todo.id);
          }

          if (!hasActive && todo.completed) {
            addUpdatedTodos(todo.id);
          }

          return updateTodoCompleted(todo.id, hasActive);
        }),
      );

      setTodos(updatedTodos);
    } catch {
      handleError(Error.UPDATE);
    } finally {
      setUpdatingTodos(new Set());
    }
  };

  const handleTodoTitle = (title: string) => {
    setTodoTitle(title);
  };

  const hasCompleted = todos.some(todo => todo.completed);
  const clearCompletedTodo = useCallback(async () => {
    try {
      const allTodoId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const removedTodos = allTodoId.map(id => removeTodo(id));

      await Promise.all(removedTodos);

      const filteredTodos = todos.filter(todo => !todo.completed);

      setTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
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
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: hasCompleted },
            )}
            // className="todoapp__toggle-all active"
            onClick={handleAllTodoCompleted}
          />

          <TodoForm
            title={todoTitle}
            onChange={handleTodoTitle}
            onAdd={handleAdd}
            isLoading={isLoading}
          />
        </header>

        <TodoList
          todos={todos}
          onDelete={handleDelete}
          isLoading={isInitialized}
          category={filterCategory}
          onUpdate={handleTodoUpdateCompleted}
          isUpdating={isUpdatingTodo}
        />
        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todosAmount} items left`}
            </span>

            <TodoFilter
              filterCategory={filterCategory}
              changeCategory={setFilterCategory}
            />

            {hasCompleted && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompletedTodo}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !todoError },
      )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className="delete"
          onClick={() => setTodoError(null)}
        />
        {todoError}
      </div>
    </div>
  );
};
