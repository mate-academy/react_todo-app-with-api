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
import { USER_ID } from './utils/userId';

function getPreperedTodos(todosForFilter: Todo[], filterField: FilterParams) {
  return todosForFilter.filter(todo => {
    switch (filterField) {
      case FilterParams.active:
        return !todo.completed;
      case FilterParams.completed:
        return todo.completed;
      default:
        return todo;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState(FilterParams.all);
  const [isLoading, setIsLoading] = useState(true);
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

  const tempTodoMarkup = (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{tempTodo?.title}</span>
      <button type="button" className="todo__remove">×</button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div className={classNames('modal overlay', {
        'is-active': tempTodo !== null,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  const todosCheck = todos.length > 0;

  const removeTodo = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const clearCompleted = () => {
    setIsLoading(true);

    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      deleteTodo(todo.id).then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(t => t.id !== todo.id);
        });
      }).catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
        .finally(() => setIsLoading(false));
    });
  };

  const createTodo = () => {
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
      .catch(error => {
        setErrorMessage('Unable to add todo');
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const patchTodo = (todoId: number, state: boolean) => {
    setIsLoading(true);

    return patchTodoStatus(todoId,
      { completed: state })
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todo.id === todoId) {
              return {
                ...todo,
                completed: state,
              };
            }

            return todo;
          });
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update todo');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (todoId: number) => {
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
      .catch(error => {
        setErrorMessage('Unable to update todo');
        throw error;
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
      .catch((error) => {
        setErrorMessage('Unable to get todos');
        throw error;
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleAll = () => {
    setIsLoading(true);

    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => {
        return patchTodo(todo.id, false).finally(() => setIsLoading(false));
      });
    } else {
      todos.forEach(todo => {
        return patchTodo(todo.id, true).finally(() => setIsLoading(false));
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
            onClick={() => toggleAll()}
          />
        )}

        <TodoForm
          todoTitle={todoTitle}
          setTodoTitle={(newTitle) => setTodoTitle(newTitle)}
          createTodo={createTodo}
        />
      </header>
      <div className="todoapp__content">
        {todosCheck && (
          <TodoList
            todos={preparedTodos}
            removeTodo={(todoId: number) => removeTodo(todoId)}
            isLoading={isLoading}
            updateTodo={updateTodo}
            updateTodoTitle={updateTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
          />
        )}
        {tempTodo !== null && tempTodoMarkup}

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
