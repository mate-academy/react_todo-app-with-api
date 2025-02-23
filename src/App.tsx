/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export enum Method {
  add = 'add',
  delete = 'delete',
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);
  const [id, setId] = useState<number>(1);

  const [hasError, setHasError] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    titleError: '',
    todosError: '',
    addError: '',
    deleteError: '',
    updateError: '',
  });

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isDeleteing, setIsDeleteing] = useState<boolean>(false);

  const [loadingForTodo, setLoadingForTodo] = useState<number[]>([]);

  const [editTodo, setEditTodo] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrors({
          ...errors,
          todosError: 'Unable to load todos',
        });
        setHasError(true);
      });
  }, [errors]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [isSubmiting, isDeleteing, loadingForTodo.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodosByStatus = todos.filter(todo => {
    if (status === Status.active) {
      return !todo.completed;
    }

    if (status === Status.completed) {
      return todo.completed;
    }

    return true;
  });

  const filterActiveTodos = todos.filter(todo => !todo.completed);
  const findCompletedTodos = () => {
    if (todos.length === 0) {
      return false;
    }

    if (todos.find(todo => todo.completed)) {
      return false;
    }

    return true;
  };

  function areTodosCompleted() {
    return !todos.find(todo => !todo.completed);
  }

  const handleDelete = () => setIsDeleteing(true);

  const handleSetLoading = (todo: Todo, method: Method) => {
    switch (method) {
      case 'add':
        return setLoadingForTodo([todo.id]);
      case 'delete':
        return setLoadingForTodo([]);
    }
  };

  const clearCompleted = () => {
    setIsDeleteing(true);

    todos.forEach(todoOnServer => {
      if (todoOnServer.completed) {
        setLoadingForTodo(prev => [...prev, todoOnServer.id]);

        deleteTodo(todoOnServer.id)
          .then(() =>
            setTodos(
              todos.filter(todoFromArr => todoFromArr.completed === false),
            ),
          )
          .catch(() => {
            setTodos([...todos, todoOnServer]);

            setHasError(true);
            setErrors({
              ...errors,
              deleteError: 'Unable to delete a todo',
            });
          })
          .finally(() => {
            setIsDeleteing(false);
            setLoadingForTodo([]);
          });
      }
    });
  };

  const reset = () => setQuery('');

  const handleSetStatus = (newStatus: Status) => setStatus(newStatus);

  const handleSetError = () => setHasError(true);

  const handleSetUpdateError = () =>
    setErrors({
      ...errors,
      updateError: 'Unable to update a todo',
    });

  const handleSetEditTodo = (todoIdForEdit: number) => {
    setEditTodo(true);
    setId(todoIdForEdit);
  };

  const handleFalseEditTodo = () => setEditTodo(false);

  const handleSetDelete = (todoId: number) => {
    setIsDeleteing(true);
    setLoadingForTodo([...loadingForTodo, todoId]);
    setId(todoId);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmiting(true);
    setHasError(false);
    setErrors({
      ...errors,
      titleError: '',
    });
    setErrors({
      ...errors,
      addError: '',
    });

    const todo = {
      id: todos.length,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (!query || /^\s+$/.test(query)) {
      setHasError(true);
      setErrors({
        ...errors,
        titleError: 'Title should not be empty',
      });
      setIsSubmiting(false);

      return;
    }

    addTodo(todo)
      .then(newTodo => {
        setTempTodo(null);
        reset();

        return setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setHasError(true);
        setTempTodo(null);
        setErrors({
          ...errors,
          addError: 'Unable to add a todo',
        });
      })
      .finally(() => {
        return setIsSubmiting(false);
      });

    todo.id = 0;
    setTempTodo(todo);
  };

  function updateTodoStatus(updatedTodo: Todo) {
    setErrors({
      ...errors,
      updateError: 'Unable to update a todo',
    });

    setLoadingForTodo(prev => [...prev, updatedTodo.id]);

    setId(updatedTodo.id);

    const newTodo = { ...updatedTodo };

    newTodo.completed = !newTodo.completed;

    updateTodo(updatedTodo, { completed: !updatedTodo.completed })
      .then(() => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setHasError(true);
        setErrors({
          ...errors,
          updateError: 'Unable to update a todo',
        });
      })
      .finally(() => {
        setLoadingForTodo(
          loadingForTodo.filter(todoId => todoId !== updatedTodo.id),
        );
      });
  }

  const toggleAll = () => {
    if (areTodosCompleted()) {
      todos.forEach(todo => {
        updateTodoStatus(todo);
      });
    } else {
      todos.forEach(todo => {
        if (todo.completed) {
          return;
        }

        updateTodoStatus(todo);
      });
    }
  };

  if (hasError) {
    setTimeout(() => setHasError(false), 3000);
  }

  if (isDeleteing && loadingForTodo.length > 0) {
    deleteTodo(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        setErrors({
          ...errors,
          deleteError: 'Unable to delete a todo',
        });
        setHasError(true);
      })
      .finally(() => {
        setLoadingForTodo([]);
        setIsDeleteing(false);
      });
  }

  const handleSetQuery = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areTodosCompleted(),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={ref}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isSubmiting}
              value={query}
              onChange={handleSetQuery}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodosByStatus}
            editTodo={editTodo}
            setEditTodo={handleSetEditTodo}
            tempTodo={tempTodo}
            loadingForTodo={loadingForTodo}
            setRemoveEditTodo={handleFalseEditTodo}
            handleDelete={handleSetDelete}
            handleUpdating={handleSetLoading}
            todoId={id}
            updateTodo={updateTodoStatus}
            setError={handleSetError}
            setUpdateError={handleSetUpdateError}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodos={filterActiveTodos}
            completedTodos={findCompletedTodos()}
            status={status}
            setStatus={handleSetStatus}
            clearCompleted={clearCompleted}
            handleSetDelete={handleDelete}
          />
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={handleSetError}
        errors={errors}
      />
    </div>
  );
};
