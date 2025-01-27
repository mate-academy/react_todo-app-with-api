import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/ToDoList';
import cn from 'classnames';
import { ErrorType } from './types/Error';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosAreLoadingIds, setTodosAreLoadingIds] = useState<number[]>([]);

  const hideErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LOAD_TODOS);
        hideErrorMessage();
      });
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setTodosAreLoadingIds(currentIds => [...currentIds, 0]);
    todoService
      .postTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.ADD_TODO);
        hideErrorMessage();
      })
      .finally(() => {
        setTodosAreLoadingIds(currentIds => currentIds.filter(id => id !== 0));
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number): Promise<boolean> => {
    return new Promise(resolve => {
      setTodosAreLoadingIds(currentIds => [...currentIds, todoId]);
      todoService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
          resolve(true);
        })
        .catch(() => {
          setErrorMessage(ErrorType.DELETE_TODO);
          hideErrorMessage();
          resolve(false);
        })
        .finally(() => {
          setTodosAreLoadingIds(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
        });
    });
  };

  const handleEmptyLineError = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorType.EMPTY_TITLE);
      hideErrorMessage();

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    addTodo({
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  };

  const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Status.ACTIVE) {
        return !todo.completed;
      }

      if (filter === Status.COMPLETED) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  const handleDeleteAllCompleted = (todosId: number[]) => {
    todosId.forEach(id => {
      deleteTodo(id);
    });
  };

  const toggleTodoStatus = (todoId: number, completed: boolean) => {
    setTodosAreLoadingIds(currentIds => [...currentIds, todoId]);

    const updatedTodo = todos.find(todo => todo.id === todoId);

    if (!updatedTodo) {
      return;
    }

    const todoToUpdate = { ...updatedTodo, completed };

    todoService
      .changeTodo(todoToUpdate, todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.UPDATE_TODO);
        hideErrorMessage();
      })
      .finally(() => {
        setTodosAreLoadingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const toggleAllTodos = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => {
      setTodosAreLoadingIds(currentIds => [...currentIds, todo.id]);

      const updatedTodo = { ...todo, completed: newStatus };

      todoService
        .changeTodo(updatedTodo, todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.map(t =>
              t.id === todo.id ? { ...t, completed: newStatus } : t,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorType.UPDATE_TODO);
          hideErrorMessage();
        })
        .finally(() => {
          setTodosAreLoadingIds(currentIds =>
            currentIds.filter(id => id !== todo.id),
          );
        });
    });
  };

  const updateTodoTitle = (
    todoId: number,
    newTitle: string,
  ): Promise<boolean> => {
    return new Promise(resolve => {
      const trimmedTitle = newTitle.trim();

      setTodosAreLoadingIds(currentIds => [...currentIds, todoId]);

      const updatedTodo = todos.find(todo => todo.id === todoId);

      if (!updatedTodo) {
        setTodosAreLoadingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        resolve(false);

        return;
      }

      if (trimmedTitle === '') {
        todoService
          .deleteTodo(todoId)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== todoId),
            );
            resolve(true);
          })
          .catch(() => {
            setErrorMessage(ErrorType.DELETE_TODO);
            hideErrorMessage();
            resolve(false);
          })
          .finally(() => {
            setTodosAreLoadingIds(currentIds =>
              currentIds.filter(id => id !== todoId),
            );
          });
      } else {
        const todoToUpdate = { ...updatedTodo, title: trimmedTitle };

        todoService
          .changeTodo(todoToUpdate, todoId)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(todo =>
                todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
              ),
            );
            resolve(true);
          })
          .catch(() => {
            setErrorMessage(ErrorType.UPDATE_TODO);
            hideErrorMessage();
            resolve(false);
          })
          .finally(() => {
            setTodosAreLoadingIds(currentIds =>
              currentIds.filter(id => id !== todoId),
            );
          });
      }
    });
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          handleChangeNewTitle={handleChangeNewTitle}
          handleEmptyLineError={handleEmptyLineError}
          errorMessage={errorMessage}
          tempTodo={tempTodo}
          toggleAllTodos={toggleAllTodos}
        />
        {!!todos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            toggleTodoStatus={toggleTodoStatus}
            updateTodoTitle={updateTodoTitle}
            todosAreLoadingIds={todosAreLoadingIds}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            onFilter={setFilter}
            filter={filter}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
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
