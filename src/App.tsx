import React, { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { addTodo, deleteTodo, editTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.loadError);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodosByStatus = () => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter((todo: Todo) => !todo.completed);

      case Status.Completed:
        return todos.filter((todo: Todo) => todo.completed);

      default:
        return todos;
    }
  };

  const filteredTodos = filterTodosByStatus();

  const createTempTodo = (tempTitle: string): Todo => {
    return {
      id: 0,
      userId: USER_ID,
      title: tempTitle,
      completed: false,
    };
  };

  const addNewTodo = (newTitle: string) => {
    const trimedTitle = newTitle.trim();

    setTempTodo(createTempTodo(newTitle));
    setIsLoading(true);

    if (trimedTitle) {
      addTodo(trimedTitle)
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.addError);
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    } else {
      setTempTodo(null);
      setIsLoading(false);
      setErrorMessage(ErrorMessage.titleError);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteSelectTodo = (todoId: number): Promise<void> => {
    setSelectedTodosIds(prevTodosIds => {
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
        setErrorMessage(ErrorMessage.deleteError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  };

  const handleClearComplete = () => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    completedTodos.map((todo: Todo) => {
      setSelectedTodosIds(prevTodosIds => {
        return [...prevTodosIds, todo.id];
      });
    });

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

        const hasError = results.find(result => result.status === 'rejected');

        if (hasError) {
          setErrorMessage(ErrorMessage.deleteError);
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  };

  const handleUpdateComplete = (todo: Todo) => {
    const todoCompleted = { ...todo };

    todoCompleted.completed = !todoCompleted.completed;
    setSelectedTodosIds(prevTodosIds => {
      return [...prevTodosIds, todo.id];
    });

    editTodo(todoCompleted)
      .then(res => {
        setTodos(prevTodos =>
          prevTodos.map((item: Todo) => (item.id === res.id ? res : item)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.updateError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  };

  const handleAllChangeStatus = (currentTodos: Todo[]) => {
    const activeTodos = currentTodos.filter(todo => !todo.completed);
    let changeStatusPromises;

    if (activeTodos.length === 0) {
      changeStatusPromises = currentTodos.map((todo: Todo) => {
        setSelectedTodosIds(prevTodosIds => {
          return [...prevTodosIds, todo.id];
        });

        return editTodo({
          ...todo,
          completed: false,
        });
      });
    } else {
      changeStatusPromises = activeTodos.map((todo: Todo) => {
        setSelectedTodosIds(prevTodosIds => {
          return [...prevTodosIds, todo.id];
        });

        return editTodo({
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

        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          setErrorMessage(ErrorMessage.updateError);
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.updateError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setSelectedTodosIds([]);
      });
  };

  const handleEditTitle = (
    newTitle: string,
    currentTodo: Todo,
  ): Promise<boolean> => {
    return new Promise(resolve => {
      setSelectedTodosIds(prevTodosIds => {
        return [...prevTodosIds, currentTodo.id];
      });

      editTodo({
        ...currentTodo,
        title: newTitle,
      })
        .then(res => {
          setTodos(prevTodos =>
            prevTodos.map((item: Todo) => (item.id === res.id ? res : item)),
          );

          resolve(true);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.updateError);
          setTimeout(() => setErrorMessage(''), 3000);

          resolve(false);
        })
        .finally(() => {
          setSelectedTodosIds([]);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          isLoading={isLoading}
          handleAllChangeStatus={handleAllChangeStatus}
        />

        <TodoList
          todos={filteredTodos}
          deleteSelectTodo={deleteSelectTodo}
          tempTodo={tempTodo}
          handleUpdateComplete={handleUpdateComplete}
          selectedTodosIds={selectedTodosIds}
          handleEditTitle={handleEditTitle}
        />

        {!!todos.length && (
          <Footer
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
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
