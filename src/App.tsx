/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessages } from './enums/ErrorMessages';
import { StatusTypes } from './enums/StatusTypes';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NONE,
  );
  const [loadings, setLoadings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusTypes>(
    StatusTypes.ALL,
  );

  const todosCount = todos.reduce((count, todo) => count + +!todo.completed, 0);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.GET_ERROR);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage(ErrorMessages.NONE);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setLoadings(currentLoadings => [...currentLoadings, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(err => {
        setErrorMessage(ErrorMessages.DELETE_ERROR);
        throw err;
      })
      .finally(() => {
        setLoadings(currentLoadings =>
          currentLoadings.filter(id => id !== todoId),
        );
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id));
  };

  const updateTodo = (todoId: number, data: Partial<Todo>) => {
    setLoadings(currentLoadings => [...currentLoadings, todoId]);

    return todoService
      .updateTodo(todoId, data)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === todoId);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(err => {
        setErrorMessage(ErrorMessages.UPDATE_ERROR);
        throw err;
      })
      .finally(() => {
        setLoadings(currentLoadings =>
          currentLoadings.filter(id => id !== todoId),
        );
      });
  };

  const toogleTodoStatus = (todo: Todo) => {
    updateTodo(todo.id, {
      completed: !todo.completed,
    });
  };

  const updateTodoTitle = (todoId: number, title: string) => {
    return updateTodo(todoId, {
      title: title,
    });
  };

  const toogleTodoStatusAll = (completed: boolean) => {
    todos.map(todo => {
      if (todo.completed !== completed) {
        updateTodo(todo.id, {
          completed: completed,
        });
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toogleTodoStatusAll={toogleTodoStatusAll}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              toogleTodoStatus={toogleTodoStatus}
              updateTodoTitle={updateTodoTitle}
              loadings={loadings}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              todos={todos}
              statusFilter={statusFilter}
            />

            <Footer
              onClearCompleted={handleClearCompleted}
              todos={todos}
              todosCount={todosCount}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
