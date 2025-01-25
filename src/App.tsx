import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import {
  createTodo,
  deleteTodo,
  updateTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import classNames from 'classnames';
import { ErrorNotification } from './types/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorNotification.loadingError);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodosByStatus = useCallback(() => {
    let filtered;

    switch (filter) {
      case FilterStatus.Active:
        filtered = todos.filter(todo => !todo.completed);
        break;
      case FilterStatus.Completed:
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }

    setFilteredTodos(filtered);
  }, [todos, filter]);

  useEffect(() => {
    filterTodosByStatus();
  }, [todos, filter, filterTodosByStatus]);

  const createTempTodo = (tempTitle: string): Todo => {
    return {
      title: tempTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };
  };

  const handleAddTodo = (newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    setTempTodo(createTempTodo(newTitle));
    setLoading(true);

    if (trimmedTitle) {
      createTodo(trimmedTitle)
        .then(newTodoResponse => {
          setTodos(prevTodos => [...prevTodos, newTodoResponse]);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorNotification.addError);
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setLoading(false);
        });
    } else {
      setTempTodo(null);
      setLoading(false);
      setErrorMessage(ErrorNotification.titleError);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteSelectTodo = (todoId: number): Promise<void> => {
    setProcessingTodoIds(prevTodosIds => {
      return [...prevTodosIds, todoId];
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo: Todo) => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorNotification.deleteError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingTodoIds([]);
      });
  };

  const handleClearComplete = () => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    const deletePromises = completedTodos.map((completedTodo: Todo) => {
      return deleteTodo(completedTodo.id);
    });

    Promise.allSettled(deletePromises)
      .then(results => {
        const successfulDeletes = completedTodos.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(
            (todo: Todo) => !successfulDeletes.includes(todo),
          ),
        );

        const errorResponse = results.find(
          result => result.status === 'rejected',
        );

        if (errorResponse) {
          setErrorMessage(ErrorNotification.deleteError);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.deleteError);
      });
  };

  const handleUpdateComplete = (todo: Todo) => {
    const todoCompleted = { ...todo };

    todoCompleted.completed = !todoCompleted.completed;
    setProcessingTodoIds(prevLoadingIds => {
      return [...prevLoadingIds, todo.id];
    });

    updateTodo(todoCompleted)
      .then(res => {
        setTodos(prevTodos =>
          prevTodos.map((item: Todo) => (item.id === res.id ? res : item)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.updateError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingTodoIds([]);
      });
  };

  const toggleAllTodosStatus = (currentTodos: Todo[]) => {
    const activeTodos = currentTodos.filter(todo => !todo.completed);
    let changeStatusPromises;

    if (activeTodos.length === 0) {
      changeStatusPromises = currentTodos.map((todo: Todo) => {
        setProcessingTodoIds(prevTodosIds => {
          return [...prevTodosIds, todo.id];
        });

        return updateTodo({
          ...todo,
          completed: false,
        });
      });
    } else {
      changeStatusPromises = activeTodos.map((todo: Todo) => {
        setProcessingTodoIds(prevLoadingIds => {
          return [...prevLoadingIds, todo.id];
        });

        return updateTodo({
          ...todo,
          completed: !todo.completed,
        });
      });
    }

    Promise.allSettled(changeStatusPromises)
      .then(results => {
        const successfulUpdates = results
          .map((result, index) => {
            if (result.status === 'fulfilled' && activeTodos.length === 0) {
              return todos[index];
            } else if (
              result.status === 'fulfilled' &&
              activeTodos.length !== 0
            ) {
              return activeTodos[index];
            } else {
              return null;
            }
          })
          .filter(todo => todo !== null);

        setTodos(prevTodos =>
          prevTodos.map(todo =>
            successfulUpdates.some(updatedTodo => updatedTodo.id === todo.id)
              ? { ...todo, completed: !todo.completed }
              : todo,
          ),
        );

        const failedUpdates = results.some(
          result => result.status === 'rejected',
        );

        if (failedUpdates) {
          setErrorMessage(ErrorNotification.updateError);
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.updateError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingTodoIds([]);
      });
  };

  const handleTitleEdit = (
    newTitle: string,
    todoToUpdate: Todo,
  ): Promise<boolean> => {
    return new Promise(resolve => {
      setProcessingTodoIds(prevTodosIds => {
        return [...prevTodosIds, todoToUpdate.id];
      });

      updateTodo({
        ...todoToUpdate,
        title: newTitle,
      })
        .then(res => {
          setTodos(prevTodos =>
            prevTodos.map((item: Todo) => (item.id === res.id ? res : item)),
          );

          resolve(true);
        })
        .catch(() => {
          setErrorMessage(ErrorNotification.updateError);
          setTimeout(() => setErrorMessage(''), 3000);

          resolve(false);
        })
        .finally(() => {
          setProcessingTodoIds([]);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={handleAddTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          errorMessage={errorMessage}
          isLoading={loading}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        <TodoList
          todos={filteredTodos}
          deleteSelectTodo={deleteSelectTodo}
          tempTodo={tempTodo}
          handleUpdateComplete={handleUpdateComplete}
          selectedTodosIds={processingTodoIds}
          handleTitleEdit={handleTitleEdit}
        />

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            handleClearComplete={handleClearComplete}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
