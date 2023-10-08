/* eslint-disable jsx-a11y/control-has-associated-label */
// #region import
import React, { useEffect, useState } from 'react';
import { Footer, Status } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Section } from './components/Section/Section';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { useTodos } from './TodoContext';
import { LoginPage } from './components/LoginPage/LoginPage';
// #endregion

function getVisibleTodos(todos: Todo[], newStatus: Status) {
  switch (newStatus) {
    case Status.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Status.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const TodoApp: React.FC = () => {
  // #region loadTodos
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setNewTitle,
    setSelectedId,
    setIsEditing,
    updatedTitle,
    setIsLoading,
    isLoading,
    user,
  } = useTodos();

  const [status, setStatus] = useState(Status.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const visibleTodos = getVisibleTodos(todos, status);
  const [isFocused, setIsFocused] = useState(true);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const idsOfCompletedTodos = completedTodos.map(todo => todo.id);

  const clearError = () => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  useEffect(clearError, [errorMessage]);

  function loadTodos() {
    if (user) {
      todoService.getTodos(user.id)
        .then(response => {
          setTodos(response);
        })
        .catch(() => {
          setErrorMessage('Unable to load todos');
        });
    }
  }

  useEffect(loadTodos, [user]);
  // #endregion

  // #region add, delete, update
  const addTodo = ({ userId, title, completed }: Todo) => {
    setIsLoading(true);
    setIsFocused(false);

    const promise = todoService.createTodo({
      userId, title: title.trim(), completed,
    })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setIsFocused(true);
      });

    if (user) {
      setTempTodo({
        id: 0, userId: user.id, title, completed,
      });
    }

    return promise;
  };

  const deleteWithEmptyTitle = (id: number) => {
    setIsLoading(true);
    setSelectedId([id]);
    setIsFocused(false);

    const promise = todoService.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setSelectedId(null);
        setIsFocused(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return promise;
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);
    setSelectedId([id]);
    setIsFocused(false);

    const promise = todoService.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(null);
        setIsFocused(true);
      });

    return promise;
  };

  const deleteCompleted = () => {
    setIsLoading(true);
    setIsFocused(false);
    setSelectedId(idsOfCompletedTodos);

    return Promise.allSettled(
      idsOfCompletedTodos.map(id => todoService.deleteTodo(id)),
    )
      .then((response) => {
        const arrDeleted: number[] = [];

        idsOfCompletedTodos.forEach((id, index) => {
          if (response[index].status === 'fulfilled') {
            arrDeleted.push(id);
          }

          if (response[index].status === 'rejected') {
            setErrorMessage('Unable to delete a todo');
          }

          const updatedTodos
            = todos.filter(todo => !arrDeleted.includes(todo.id));

          setTodos(updatedTodos);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(null);
        setIsFocused(true);
      });
  };

  const toggleStatus = (todo: Todo) => {
    const {
      id, userId, title, completed,
    } = todo;

    setSelectedId([id]);
    setIsLoading(true);

    return todoService.updateTodo({
      id, userId, title, completed: !completed,
    })
      .then((newTodo) => {
        const newTodos = [...todos];
        const index = newTodos.findIndex(item => item.id === id);

        newTodos.splice(index, 1, newTodo);
        setTodos(newTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setSelectedId(null);
        setIsLoading(false);
      });
  };

  const toggleAll = () => {
    setIsLoading(true);
    const activeTodo = todos.filter(todo => !todo.completed);

    let updatingTodo = [...todos];

    if (activeTodo.length > 0) {
      updatingTodo = activeTodo;
    }

    const arrOfUpdatingIds = updatingTodo.map(i => i.id);

    setSelectedId(arrOfUpdatingIds);

    return Promise.all(
      updatingTodo.map(todo => {
        const {
          id, userId, title, completed,
        } = todo;

        return todoService.updateTodo({
          id, userId, title, completed: !completed,
        });
      }),
    )
      .then((newTodos) => {
        const updatedTodos = [...todos];

        newTodos.forEach(item => {
          const index = updatedTodos.findIndex(i => i.id === item.id);

          updatedTodos.splice(index, 1, item);
        });

        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(null);
      });
  };

  const updateTodo = (todo: Todo) => {
    const {
      id, userId, completed,
    } = todo;

    if (!updatedTitle.trim()) {
      if (isLoading) {
        return;
      }

      deleteWithEmptyTitle(id);

      return;
    }

    setSelectedId([id]);
    setIsLoading(true);

    todoService.updateTodo({
      id, userId, title: updatedTitle.trim(), completed,
    })
      .then((newTodo) => {
        const newTodos = [...todos];
        const index = newTodos.findIndex(item => item.id === id);

        newTodos.splice(index, 1, newTodo);

        setTodos(newTodos);
        setSelectedId(null);
        setIsEditing(false);
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage('Unable to update a todo');
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // #endregion
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          isFocused={isFocused}
          userId={user.id}
          onSubmit={addTodo}
          toggleAll={toggleAll}
        />

        {visibleTodos && (
          <Section
            tempTodo={tempTodo}
            visibleTodos={visibleTodos}
            onDelete={deleteTodo}
            toggleStatus={toggleStatus}
            onSubmit={updateTodo}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <Footer
            setStatus={setStatus}
            currentStatus={status}
            onClearCompleted={deleteCompleted}
            completedTodos={completedTodos}
            activeTodos={activeTodos}
          />
        )}

      </div>

      <Error />
    </div>
  );
};
