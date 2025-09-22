/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';
import { NotificationType } from './types/NotificationType';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Filter } from './components/Filter/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line max-len
import { NotificationMessage } from './components/Notification/NotificationMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [loading, setLoading] = useState<boolean | number>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(todosResponse => {
        if (todosResponse.length === 0) {
          handleErrorMessage(NotificationType.LOAD_TODOS);
        }

        setTodos(todosResponse);
      })
      .catch(err => {
        handleErrorMessage(NotificationType.LOAD_TODOS);

        throw err;
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;

      default:
        return todo;
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onAddNewTodo(todo: Todo) {
    setLoading(true);
    setTempTodo(todo);

    return addTodo(todo)
      .then(newTodoResponse => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodoResponse];
        });
      })
      .catch(err => {
        handleErrorMessage(NotificationType.ADD_TODO);
        inputRef?.current?.focus();
        throw err;
      })
      .finally(() => {
        setTempTodo(undefined);
        setLoading(false);
        inputRef?.current?.focus();
      });
  }

  function onToggleCompleted(
    todoId: number,
    completed: boolean,
  ): Promise<void> {
    setLoading(todoId);

    return updateTodo(todoId, { completed })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      })
      .catch(err => {
        handleErrorMessage(NotificationType.UPDATE_TODO);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onToggleAllCompleted() {
    setLoading(true);

    const allCompleted = todos.every(todo => todo.completed);

    // Only update todos that need to change
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    const toggleAll = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: !allCompleted })
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === todo.id
                ? { ...currentTodo, completed: !allCompleted }
                : currentTodo,
            ),
          );
        })
        .catch(err => {
          handleErrorMessage(NotificationType.UPDATE_TODO);
          throw err;
        }),
    );

    Promise.all(toggleAll).finally(() => {
      setLoading(false);
    });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);

    const deleteCompleted = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(err => {
          handleErrorMessage(NotificationType.DELETE_TODO);

          throw err;
        }),
    );

    Promise.all(deleteCompleted)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .finally(() => {
        setLoading(false);
        inputRef.current?.focus();
      });
  }

  const onDeleteTodo = (todoId: number) => {
    setLoading(todoId);

    inputRef.current?.focus();

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(err => {
        setTodos(todos);
        handleErrorMessage(NotificationType.DELETE_TODO);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function onEditTodoTitle(todoId: number, newTitle: string): Promise<void> {
    setLoading(todoId);
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle.length === 0) {
      return onDeleteTodo(todoId);
    }

    return updateTodo(todoId, { title: trimmedTitle })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
          ),
        );
      })
      .catch(err => {
        handleErrorMessage(NotificationType.UPDATE_TODO);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleAll={onToggleAllCompleted}
          onSubmit={onAddNewTodo}
          userID={USER_ID}
          setError={handleErrorMessage}
          inputRef={inputRef}
          loader={loading}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={onDeleteTodo}
          tempTodo={tempTodo}
          loader={loading}
          onToggleCompleted={onToggleCompleted}
          onEditTitle={onEditTodoTitle}
        />

        {todos.length !== 0 && (
          <Filter
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <NotificationMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
