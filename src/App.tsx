/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList/TodoList';
import { Todo, ErrorMessages, StatusTodos } from './types/Todo';
import { deleteTodo, getTodos, postTodo, updateTodo } from './api/todos';
import classNames from 'classnames';
import TodoHeader from './components/TodoHeader/TodoHeader';

const filtredTodos = (status: StatusTodos, todos: Todo[]): Todo[] => {
  return todos.filter(todo => {
    switch (status) {
      case StatusTodos.ACTIVE:
        return !todo.completed;
      case StatusTodos.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });
};

const FILTERS_ORDER = [
  StatusTodos.ALL,
  StatusTodos.ACTIVE,
  StatusTodos.COMPLETED,
];

const getFilterHref = (status: StatusTodos) => {
  switch (status) {
    case StatusTodos.ACTIVE:
      return '#/active';
    case StatusTodos.COMPLETED:
      return '#/completed';
    default:
      return '#/';
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterStatus, setFilterStatus] = useState<StatusTodos>(
    StatusTodos.ALL,
  );

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NO_ERROR,
  );

  // Load Todos
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.ERROR_LOAD_TODOS));
  }, []);

  // Error Message Timer
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessages.NO_ERROR);
    }, 3000);

    return () => clearInterval(timerId);
  }, [errorMessage]);

  // Add Todo handler
  function handlePostTodo(title: string): Promise<void> {
    const newTempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: 0,
    };

    setTempTodo(newTempTodo);

    return postTodo(title)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ERROR_ADD_TODO);

        throw new Error('Unable to add todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== 0));
        setTempTodo(null);
      });
  }

  //Delete Todo Handler
  function handleDeleteTodo(todoId: number) {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessages.ERROR_DELETE_TODO))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  }

  //ClearCompleted TodoHandler
  function handlerClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosId = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedTodosId]);

    const promisess = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(promisess)
      .then(results => {
        const succesfullDeleteId: number[] = [];
        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            hasError = true;
          } else {
            succesfullDeleteId.push(completedTodos[index].id);
          }
        });

        if (hasError) {
          setErrorMessage(ErrorMessages.ERROR_DELETE_TODO);
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo => !succesfullDeleteId.includes(todo.id)),
        );
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !completedTodosId.includes(id)),
        );
      });
  }

  function handleUpdateCompleted(todo: Todo) {
    setLoadingIds(prev => [...prev, todo.id]);
    const newCompletedStatus = !todo.completed;

    updateTodo(todo.id, { completed: newCompletedStatus })
      .then(() => {
        setTodos(prev => {
          return prev.map(item => {
            if (item.id !== todo.id) {
              return item;
            }

            return { ...item, completed: newCompletedStatus };
          });
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ERROR_UPDATE_TODO);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  }

  function handleToogleCompleted() {
    const targetStatus = todos.every(todo => todo.completed);
    let todosToUpdated: Todo[] = [];

    if (targetStatus) {
      todosToUpdated = [...todos];
    } else {
      todosToUpdated = todos.filter(todo => !todo.completed);
    }

    setLoadingIds(prev => [...prev, ...todosToUpdated.map(todo => todo.id)]);

    const newStatus = !targetStatus;

    const promises = todosToUpdated.map(todo => {
      return updateTodo(todo.id, { completed: newStatus });
    });

    Promise.allSettled(promises)
      .then(results => {
        const succesfullUpdateId: number[] = [];

        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            succesfullUpdateId.push(todosToUpdated[index].id);
          } else {
            hasError = true;
          }
        });

        if (hasError) {
          setErrorMessage(ErrorMessages.ERROR_UPDATE_TODO);
        }

        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (succesfullUpdateId.includes(todo.id)) {
              return { ...todo, completed: newStatus };
            }

            return todo;
          }),
        );
      })
      .finally(() => {
        const idToRemove = todosToUpdated.map(todo => todo.id);

        setLoadingIds(prev => prev.filter(id => !idToRemove.includes(id)));
      });
  }

  async function handleUpdateTitle(todoId: number, newTitle: string) {
    setLoadingIds(prev => [...prev, todoId]);

    return updateTodo(todoId, { title: newTitle })
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todoId === todo.id) {
              return { ...todo, title: newTitle };
            }

            return todo;
          });
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.ERROR_UPDATE_TODO);
        throw new Error('Unable to update todo');
      })
      .finally(() => {
        setLoadingIds(prev => [...prev.filter(id => id !== todoId)]);
      });
  }

  const filterTodos = filtredTodos(filterStatus, todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={handlePostTodo}
          disabled={loadingIds.length > 0 || tempTodo !== null}
          onErrorMessage={setErrorMessage}
          onToogleCompleted={handleToogleCompleted}
          isShowButtonToogle={todos.length !== 0}
          isActiveToogleButton={todos.every(todo => todo.completed)}
        />

        <TodoList
          todos={filterTodos}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onUpdateCompleted={handleUpdateCompleted}
          onUpdateTitle={handleUpdateTitle}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {FILTERS_ORDER.map(filter => (
                <a
                  key={filter}
                  href={getFilterHref(filter)}
                  className={classNames('filter__link', {
                    selected: filterStatus === filter,
                  })}
                  data-cy={`FilterLink${filter}`}
                  onClick={() => setFilterStatus(filter)}
                >
                  {filter}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={handlerClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessages.NO_ERROR)}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
