/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilterBar } from './components/TodoFilterBar';
import { TodoErrors } from './components/TodoErrors';
import { Todo } from './types/Todo';
import {
  addTodo,
  getTodos,
  deleteTodo,
  patchTodoStatus,
  patchTodoTitle,
} from './api/todos';
import { FilterParams } from './types/FilterParams';
import { USER_ID } from './utils/constants';
import { getPreperedTodos } from './utils/getPreperedTodos';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState(FilterParams.all);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const preparedTodos = useMemo(() => {
    return getPreperedTodos(todos, filter);
  }, [todos, filter]);

  const clearError = () => {
    setErrorMessage('');
  };

  const applyFilter = (filterField: FilterParams) => {
    setFilter(filterField);
  };

  const todosCheck = todos.length > 0;

  const removeTodo = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const clearCompleted = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      setLoadingIds(prevIds => [...prevIds, todo.id]);

      removeTodo(todo.id).finally(() => setLoadingIds([]));
    });
  };

  const createTodo = () => {
    if (!todoTitle) {
      setErrorMessage('Title can`t be empty');

      return Promise.reject();
    }

    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });

    return addTodo({
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add todo');
      })
      .finally(() => setTempTodo(null));
  };

  const updateTodoStatus = (todoId: number) => {
    const switchedTodo = todos.find(t => t.id === todoId);

    return patchTodoStatus(todoId,
      { completed: !switchedTodo?.completed })
      .then(() => {
        if (switchedTodo) {
          setTodos(prevTodos => {
            return prevTodos.map(todo => {
              if (todo.id === todoId) {
                return {
                  ...todo,
                  completed: !todo.completed,
                };
              }

              return todo;
            });
          });
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update todo');
      });
  };

  const updateTodoTitle = (todoId: number) => {
    const changedTodo = todos.find(t => t.id === todoId);

    return patchTodoTitle(todoId,
      { title: newTodoTitle })
      .then(() => {
        if (changedTodo) {
          setTodos(prevTodos => {
            return prevTodos.map(todo => {
              if (todo.id === todoId) {
                return {
                  ...todo,
                  title: newTodoTitle,
                };
              }

              return todo;
            });
          });
        }
      })
      .catch(error => {
        setErrorMessage('Unable to update todo');
        throw error;
      });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to get todos');
      });
  }, []);

  const toggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => {
        setLoadingIds(prevIds => [...prevIds, todo.id]);

        return updateTodoStatus(todo.id).finally(() => setLoadingIds([]));
      });
    } else {
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      uncompletedTodos.forEach(todo => {
        setLoadingIds(prevIds => [...prevIds, todo.id]);

        return updateTodoStatus(todo.id).finally(() => setLoadingIds([]));
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {todosCheck && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            onClick={toggleAll}
          />
        )}

        <TodoForm
          todoTitle={todoTitle}
          onTodoCreate={setTodoTitle}
          createTodo={createTodo}
        />
      </header>
      <div className="todoapp__content">
        {todosCheck && (
          <TodoList
            todos={preparedTodos}
            removeTodo={removeTodo}
            loadingIds={loadingIds}
            updateTodo={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
            changeTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
          />
        )}
        {tempTodo !== null && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
            changeTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
            loadingIds={[tempTodo.id]}
          />
        )}

        {todosCheck && (
          <TodoFilterBar
            filter={filter}
            applyFilter={applyFilter}
            clearCompleted={clearCompleted}
            todos={todos}
          />
        )}
      </div>

      <TodoErrors
        error={errorMessage}
        clearError={clearError}
      />
    </div>
  );
};
