/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  updateTodoOnServer,
  updateTodosCheckbox,
  USER_ID,
} from './api/todos';
import { Errors } from './types/Todo';
import { TodoHeader } from './component/TodoHeader/TodoHeader';
import { TodoFooter } from './component/TodoFooter/TodoFooter';
import { Status } from './types/Status';
import { TodoList } from './component/TodoList/TodoList';
import { TodoErrorNotification } from './component/TodoErrorNotification/TodoErrorNotification';

export const App: React.FC = () => {
  const [status, setStatus] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [inputRefTarget, setInputRefTarget] = useState<HTMLInputElement | null>(
    null,
  );
  const [error, setError] = useState<Errors>(Errors.None);

  interface Todo {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
  }

  function handleError(type: Errors) {
    setError(type);
    setTimeout(() => setError(Errors.None), 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Errors.LoadTodoError);
      });
  }, []);

  const isErrorHidden = () => !error;

  function updateTodoTitle(
    todo: Todo,
    onSuccess?: VoidFunction,
  ): Promise<void> {
    setLoadingTodoIds(prevState => [...prevState, todo.id]);
    return updateTodoOnServer(todo) // Функция API для обновления title
      .then(updatedTodo => {
        setTodos?.(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(prevTodo => prevTodo.id === todo.id);
          if (index !== -1) {
            newTodos.splice(index, 1, updatedTodo);
          }
          return newTodos;
        });
        setError(Errors.None);
        onSuccess?.();
      })
      .catch(() => {
        handleError(Errors.UpdateTodoError);
      })
      .finally(() => {
        setLoadingTodoIds(prevState =>
          prevState.filter(prevTodo => prevTodo !== todo.id),
        );
      });
  }

  function updateTodo(todo: Todo) {
    setError(Errors.None);
    setLoadingTodoIds(prevState => [...prevState, todo.id]);
    const newStatus = !todo.completed;
    updateTodoOnServer({ ...todo, completed: newStatus })
      .then(todo => {
        setTodos?.(currentPost => {
          const newTodos = [...currentPost];
          const index = newTodos.findIndex(prevTodo => prevTodo.id === todo.id);
          newTodos.splice(index, 1, todo);
          return newTodos;
        });
      })
      .catch(() => {
        handleError(Errors.UpdateTodoError);
      })
      .finally(() => {
        setLoadingTodoIds(prevState =>
          prevState.filter(prevTodo => prevTodo !== todo.id),
        );
      });
  }

  const filteredTodos = todos.filter(todo => {
    if (status === Status.active) {
      return !todo.completed;
    }
    if (status === Status.completed) {
      return todo.completed;
    }
    return true;
  });

  function deleteTodo(todoId: number) {
    setError(Errors.None);
    setLoadingTodoIds(prevState => [...prevState, todoId]);
    return deleteTodos(todoId)
      .then(() => {
        setTodos(currentPosts =>
          currentPosts.filter(todo => todo.id !== todoId),
        );
        inputRefTarget?.focus();
      })
      .catch(() => {
        handleError(Errors.DeleteTodoError);
        inputRefTarget?.focus();
        return;
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoIds(prevState =>
          prevState.filter(todo => todo !== todoId),
        );
      });
  }

  function deleteCompletedTodo() {
    setError(Errors.None);
    const filteredTodos = todos.filter(todo => todo.completed);
    Promise.all(filteredTodos.map(todo => deleteTodo(todo.id))).catch(() => {
      handleError(Errors.DeleteTodoError);
    });
  }

  const allCompleted = todos.every(todo => todo.completed);

  function updateAllTodo() {
    setError(Errors.None);
    const todoToUpdate = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);
    const loadingIds = todoToUpdate.map(todo => todo.id);
    setLoadingTodoIds(prevState => [...prevState, ...loadingIds]);
    const newStatus = !allCompleted;
    Promise.all(todoToUpdate.map(todo => updateTodosCheckbox(todo, newStatus)))
      .then(todos => {
        const todosIds = todos.map((todo: Todo) => todo.id);
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (todosIds.includes(todo.id)) {
              return { ...todo, completed: newStatus };
            }
            return todo;
          }),
        );
      })
      .finally(() =>
        setLoadingTodoIds(prevState =>
          prevState.filter(todo => !loadingIds.includes(todo)),
        ),
      )
      .catch(() => {
        handleError(Errors.UpdateTodoError);
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          handleError={handleError}
          setTodos={setTodos}
          // resetError={resetError}
          setTempTodo={setTempTodo}
          setIsLoading={setIsLoading}
          error={error}
          isLoading={isLoading}
          setInputRefTarget={setInputRefTarget}
          inputRefTarget={inputRefTarget}
          updateAllTodo={updateAllTodo}
          allCompleted={allCompleted}
          todos={todos}
        />
        {(tempTodo || todos.length > 0) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              deleteTodo={deleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdateTodo={updateTodo}
              updateTodoTitle={updateTodoTitle}
            />
            <TodoFooter
              todos={todos}
              status={status}
              setStatus={setStatus}
              deleteCompletedTodo={deleteCompletedTodo}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        getErrorMessage={error}
        isErrorHidden={isErrorHidden}
        setError={setError}
      />
    </div>
  );
};
