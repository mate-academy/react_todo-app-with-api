/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { FilterStatus, Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodoStatus,
  patchTodoTitle,
} from './utils/todosMethods';
import { Error } from './components/Error';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11220;

function getPreparedTodo(todosFilter: Todo[], filterField: FilterStatus) {
  return todosFilter.filter(todo => {
    switch (filterField) {
      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.Active:
        return !todo.completed;

      default:
        return todo;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const clearError = () => {
    setErrorMessage('');
  };

  const applyFilter = (filterField: FilterStatus) => {
    setFilter(filterField);
  };

  const preparedTodo = useMemo(() => {
    return getPreparedTodo(todos, filter);
  }, [todos, filter]);

  const createTodo = () => {
    if (todoTitle.trim().length === 0) {
      setErrorMessage('Title can`t be empty');

      return Promise.reject();
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    return addTodo({
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(previousTodo => [...previousTodo, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Can`t add new todo');
      })
      .finally(() => setTempTodo(null));
  };

  const removeTodo = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(previousTodos => {
          return previousTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Can`t delete todo');
      });
  };

  const clearCompleted = () => {
    const completedTodoIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    setLoadingId(completedTodoIds);

    Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)))
      .then(() => {
        setTodos(previousTodos => previousTodos.filter(todo => !todo.completed));
        setLoadingId([]);
      });
  };

  const updateTodo = (todoId: number) => {
    const switchedTodo = todos.find(todo => todo.id === todoId);

    return patchTodoStatus(todoId,
      { completed: !switchedTodo?.completed })
      .then(() => {
        if (switchedTodo) {
          setTodos(previousTodos => previousTodos.map(todo => (todo.id === todoId
            ? { ...todo, completed: !todo.completed }
            : todo)));
        }
      })
      .catch(() => {
        setErrorMessage('Can`t update todo');
      });
  };

  const updateTodoTitle = useCallback((todoId: number) => {
    const changedTodo = todos.find(todo => todo.id === todoId);

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
      .catch(() => {
        setErrorMessage('Unable to update todo');
      });
  }, [todos, newTodoTitle, patchTodoTitle]);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Can`t get todo');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => {
        setLoadingId(prevIds => [...prevIds, todo.id]);

        return updateTodo(todo.id).finally(() => setLoadingId([]));
      });
    } else {
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      uncompletedTodos.forEach(todo => {
        setLoadingId(prevIds => [...prevIds, todo.id]);

        return updateTodo(todo.id).finally(() => setLoadingId([]));
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {todos.length > 0 && (
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
          onCreate={setTodoTitle}
          createTodo={createTodo}
        />
      </header>
      <div className="todoapp__content">
        {todos.length > 0 && (
          <TodoList
            todos={preparedTodo}
            deleteTodo={removeTodo}
            loadingId={loadingId}
            updateTodo={updateTodo}
            newTodoTitle={newTodoTitle}
            updateTodoTitle={updateTodoTitle}
            changeTodoTitle={setNewTodoTitle}
          />
        )}
        {
          tempTodo !== null
          && (
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              updateTodoTitle={updateTodoTitle}
              changeTodoTitle={setNewTodoTitle}
              newTodoTitle={newTodoTitle}
              loadingId={[tempTodo.id]}
            />
          )
        }

        {todos.length > 0 && (
          <TodoFilter
            select={filter}
            filter={applyFilter}
            clearCompleted={clearCompleted}
            todos={todos}
          />
        )}
      </div>

      <Error
        message={errorMessage}
        onClose={clearError}
      />
    </div>
  );
};
