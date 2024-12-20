/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { Errors } from './types/Errors';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);
  const [status, setStatus] = useState<string>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(Errors.UnableToLoad);
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const notCompletedTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  function onCreateTodo({ userId, title, completed }: Todo) {
    setErrorMessage(Errors.Empty);

    return todoService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(Errors.UnableToAdd);

        throw error;
      });
  }

  function onDeleteTodo(todoId: number) {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.UnableToDelete);

        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  }

  function onClearCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  }

  function onUpdateTodo(updatedTodo: Todo) {
    setLoadingTodoIds(currentIds => [...currentIds, updatedTodo.id]);

    return todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.UnableToUpdate);

        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== updatedTodo.id),
        ),
      );
  }

  function onToogleAllTodos() {
    if (
      completedTodosCount === todos.length ||
      notCompletedTodosCount === todos.length
    ) {
      todos.forEach(todo =>
        onUpdateTodo({ ...todo, completed: !todo.completed }),
      );
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          onUpdateTodo({ ...todo, completed: true });
        }
      });
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onCreateTodo={onCreateTodo}
          onToogleAllTodos={onToogleAllTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          completedTodosCount={completedTodosCount}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
        />
        {!!todos.length && (
          <Footer
            notCompletedTodosCount={notCompletedTodosCount}
            completedTodosCount={completedTodosCount}
            status={status}
            setStatus={setStatus}
            onClearCompletedTodos={onClearCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
