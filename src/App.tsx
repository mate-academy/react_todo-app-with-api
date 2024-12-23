/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as clientTodo from './api/todos';
import { getFilteredTodos } from './utils/getFilteredTodos';

import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeStatus, setActiveStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, activeStatus),
    [todos, activeStatus],
  );
  const notCompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );
  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const isToogleAll = completedTodos.length === todos.length;

  const onAddTodo = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      userId: clientTodo.USER_ID,
      completed: false,
    });

    const newTodo: Omit<Todo, 'id'> = {
      title,
      userId: clientTodo.USER_ID,
      completed: false,
    };

    return clientTodo
      .createTodos(newTodo)
      .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
      .catch(err => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw err;
      })
      .finally(() => setTempTodo(null));
  };

  const onUpdateTodo = (todoToUpdate: Todo) => {
    setLoadingTodoIds(prevTodos => [...prevTodos, todoToUpdate.id]);

    return clientTodo
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(err => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prevTodos =>
          prevTodos.filter(id => todoToUpdate.id !== id),
        );
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(prevTodos => [...prevTodos, todoId]);

    clientTodo
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() =>
        setLoadingTodoIds(prevTodos => prevTodos.filter(id => todoId !== id)),
      );
  };

  const onDeleteAllCompleted = () => {
    completedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  const onToggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => onUpdateTodo({ ...todo, completed: false }));
    } else {
      todos.filter(todo => {
        if (!todo.completed) {
          onUpdateTodo({ ...todo, completed: true });
        }
      });
    }
  };

  useEffect(() => {
    clientTodo
      .getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      });
  }, []);

  if (!clientTodo.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          error={errorMessage}
          isToogleAll={todos.length === 0 ? null : isToogleAll}
          isInputDisablet={!!tempTodo}
          isDeletedTodos={todos.length}
          onAddTodo={onAddTodo}
          onToggleAll={onToggleAll}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          tempTodo={tempTodo}
          filteredTodos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {!!todos.length && (
          <TodoFooter
            activeStatus={activeStatus}
            completedTodos={completedTodos.length}
            notCompletedTodos={notCompletedTodos.length}
            onDeleteAllCompleted={onDeleteAllCompleted}
            setActiveStatus={setActiveStatus}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
