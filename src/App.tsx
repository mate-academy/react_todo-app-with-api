/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';

function getPrepearedTodos(
  todos: Todo[],
  {
    status,
  }: {
    status: Status;
  },
): Todo[] {
  let preparedTodos = [...todos];

  if (status) {
    switch (status) {
      case Status.Active:
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;
      case Status.Completed:
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;
    }
  }

  return preparedTodos;
}

export const App: React.FC = () => {
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage(ErrorMessage.Default);

    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Unable_to_load_todos))
      .finally(() => setLoadingTodos(false));
  }, []);

  const visibleTodos = getPrepearedTodos(todos, { status });
  const activeTodos = getPrepearedTodos(todos, {
    status: Status.Active,
  });
  const complitedTodos = getPrepearedTodos(todos, {
    status: Status.Completed,
  });

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage(ErrorMessage.Default);

    return todoServise
      .addTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => {
        setErrorMessage(ErrorMessage.Unable_to_add_a_todo);
        throw error;
      });
  };

  const updateTodo = useCallback((todoToUpdate: Todo) => {
    setLoadingTodoIds(currentId => [...currentId, todoToUpdate.id]);

    return todoServise
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Unable_to_update_a_todo);
        throw error;
      })
      .finally(() => setLoadingTodoIds([]));
  }, []);

  const toggleAll = () => {
    if (activeTodos.length > 0) {
      Promise.all(
        activeTodos.map(todo => updateTodo({ ...todo, completed: true })),
      );
    } else {
      Promise.all(todos.map(todo => updateTodo({ ...todo, completed: false })));
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(currentId => [...currentId, todoId]);

    return todoServise
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setErrorMessage(ErrorMessage.Unable_to_delete_a_todo);
        throw error;
      })
      .finally(() => setLoadingTodoIds([]));
  };

  const deleteCompletedTodos = () => {
    Promise.all(complitedTodos.map(todo => deleteTodo(todo.id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          key={todos.length}
          onSubmit={addTodo}
          setErrorMessage={setErrorMessage}
          onTempTodo={setTempTodo}
          tempTodo={tempTodo}
          complitedTodosLength={complitedTodos.length}
          toggleAll={toggleAll}
          loadingTodos={loadingTodos}
          todosLength={todos.length}
        />

        {loadingTodos && 'Loading...'}

        {!loadingTodos && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onUpdate={updateTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeTodos.length}
            complitedCount={complitedTodos.length}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
