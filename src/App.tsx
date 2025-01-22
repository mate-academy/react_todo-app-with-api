import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { TodoInfo } from './components/TodoInfo';
import { TodoType } from './enums/TodoType';
import { Error } from './enums/Error';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [changedTitle, setChangedTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<Todo[] | null>([]);
  const [todosType, setTodosType] = useState<TodoType>(TodoType.all);
  const [completedTodosCount, setCompletedTodosCount] = useState(0);
  const [changingTodo, setChangingTodo] = useState<Todo | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverTodosCount, setServerTodosCount] = useState(0);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoServise
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setServerTodosCount(fetchedTodos.length);
      })
      .catch(() => {
        setErrorMessage(Error.loadError);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCompletedTodosCount(todos.filter(todo => todo.completed).length);
  }, [todos]);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, errorMessage]);

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  const handleSubmitButton = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage(null);

    if (title.trim() === '') {
      setErrorMessage(Error.titleError);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    setTempTodo({
      title: title,
      completed: false,
      userId: todoServise.USER_ID,
      id: 0,
    });

    const newTempTodo: Todo = {
      title: title.trim(),
      completed: false,
      userId: todoServise.USER_ID,
      id: 0,
    };

    setTempTodo(newTempTodo);
    setLoadingTodos([newTempTodo]);
    setIsSubmitting(true);

    todoServise
      .addTodos({
        title: title.trim(),
        completed: false,
        userId: todoServise.USER_ID,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
        setServerTodosCount(currentCount => currentCount + 1);
      })
      .catch(error => {
        setErrorMessage(Error.addError);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTodos(null);
        setIsSubmitting(false);
      });
  };

  const completeTodo = (todoId: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    );

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (todoToUpdate) {
      setLoadingTodos([todoToUpdate]);

      todoServise
        .updateTodos({
          ...todoToUpdate,
          completed: !todoToUpdate.completed,
        })
        .then(() => {
          setTodos(updatedTodos);
        })
        .catch(() => {
          setErrorMessage(Error.updateError);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(null);
        });
    }
  };

  const handleToggleAllButton = () => {
    const hasIncompleteTodos = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== hasIncompleteTodos,
    );

    setLoadingTodos(todosToUpdate);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: hasIncompleteTodos,
    }));

    setTodos(updatedTodos);

    todosToUpdate.forEach(todo => {
      todoServise
        .updateTodos({
          ...todo,
          completed: hasIncompleteTodos,
        })
        .catch(() => {
          setErrorMessage(Error.updateError);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(null);
        });
    });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodos(todos.filter(todo => todo.id === todoId));
    todoServise
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setServerTodosCount(currentCount => currentCount - 1);
      })
      .catch(() => {
        setErrorMessage(Error.deleteError);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(null);
      });
  };

  const clearCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setServerTodosCount(currentCount => currentCount - completedTodos.length);

    setLoadingTodos(completedTodos);

    completedTodos.forEach(completedTodo => {
      todoServise
        .deleteTodos(completedTodo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== completedTodo.id),
          );
        })
        .catch(() => {
          setErrorMessage(Error.deleteError);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(null);
        });
    });
  };

  const handleTitleChange = (event: React.FormEvent, updatedTodo: Todo) => {
    event.preventDefault();

    if (changedTitle.trim() === '') {
      setLoadingTodos([updatedTodo]);

      todoServise
        .deleteTodos(updatedTodo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== updatedTodo.id),
          );
          setServerTodosCount(currentCount => currentCount - 1);
        })
        .catch(() => {
          setErrorMessage(Error.deleteError);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(null);
        });

      return;
    }

    if (changedTitle.trim() === updatedTodo.title) {
      setChangingTodo(undefined);
      setChangedTitle('');

      return;
    }

    const updatedTodoWithNewTitle = {
      ...updatedTodo,
      title: changedTitle.trim(),
    };

    setLoadingTodos([updatedTodoWithNewTitle]);

    todoServise
      .updateTodos(updatedTodoWithNewTitle)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodoWithNewTitle : todo,
          ),
        );
        setChangingTodo(undefined);
        setChangedTitle('');
      })
      .catch(() => {
        setErrorMessage(Error.updateError);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <Header
            todos={todos}
            handleToggleAllButton={handleToggleAllButton}
            handleSubmitButton={handleSubmitButton}
            title={title}
            setTitle={setTitle}
            isSubmitting={isSubmitting}
            titleField={titleField}
            serverTodosCount={serverTodosCount}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={todos.filter(todo => {
              switch (todosType) {
                case TodoType.active:
                  return !todo.completed;
                case TodoType.completed:
                  return todo.completed;
                case TodoType.all:
                default:
                  return true;
              }
            })}
            completeTodo={completeTodo}
            changingTodo={changingTodo}
            setChangingTodo={setChangingTodo}
            changedTitle={changedTitle}
            setChangedTitle={setChangedTitle}
            deleteTodo={deleteTodo}
            handleTitleChange={handleTitleChange}
            loadingTodos={loadingTodos}
          />

          {tempTodo && (
            <TodoInfo
              todo={tempTodo}
              completeTodo={completeTodo}
              changingTodo={changingTodo}
              setChangingTodo={setChangingTodo}
              changedTitle={changedTitle}
              setChangedTitle={setChangedTitle}
              deleteTodo={deleteTodo}
              handleTitleChange={handleTitleChange}
              loadingTodos={loadingTodos}
            />
          )}
        </section>

        {serverTodosCount > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <Footer
              todos={todos}
              completedTodosCount={completedTodosCount}
              todosType={todosType}
              setTodosType={setTodosType}
              clearCompletedTodo={clearCompletedTodo}
            />
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
