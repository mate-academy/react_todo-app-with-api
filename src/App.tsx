/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Status, Todo } from './types/Todo';
import * as todosServise from './api/todos';
import { TodoFilter } from './components/TodosFilter';
import { ToggleButton } from './components/ToggleButton';
import { TodoForm } from './components/TodoForm';
import { TodosList } from './components/TodosList';
import { Error } from './types/Error';
import { ErrorNotifications } from './components/ErrorNotifications';
import { USER_ID } from './utils/variables';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [pending, setPending] = useState(false);
  const [todoIds, setTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorType(Error.Load);
        throw error;
      });
  }, []);

  const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setErrorType(null);
    setPending(true);
    setTodoIds([0]);

    setTempTodo({
      title,
      completed,
      userId,
      id: 0,
    });

    return todosServise.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorType(Error.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setPending(false);
      });
  };

  const shownTodos = useMemo(() => {
    return todosServise.getVisibleTodos(todos, status);
  }, [todos, status]);

  const onDelete = (todoId: number) => {
    setErrorType(null);
    setTodoIds(currentTodosIds => [...currentTodosIds, todoId]);

    todosServise.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(shownTodos);
        setErrorType(Error.Delete);
        throw error;
      })
      .finally(() => {
        setTodoIds(currentTodosIds => currentTodosIds.filter(id => id !== todoId));
      });
  };

  const changeTodo = (newTodo: Todo) => {
    todosServise.updateTodo(newTodo)
      .then((todo) => {
        setTodos(currentTodos => currentTodos.map(currentTodo => (currentTodo.id === todo.id ? todo : currentTodo)));
      })
      .catch((error) => {
        setErrorType(Error.Update);
        throw error;
      })
      .finally(() => {
        setTodoIds(currentTodosIds => currentTodosIds.filter(id => id !== newTodo.id));
      });
  };

  const changeTodoSatus = (selectedTodo: Todo) => {
    setErrorType(null);
    setTodoIds(currentTodosIds => [...currentTodosIds, selectedTodo.id]);

    const newTodo = {
      ...selectedTodo,
      completed: !selectedTodo.completed,
    };

    changeTodo(newTodo);
  };

  const areAllActiveTodos = todos.some(todo => !todo.completed);

  const handleToggleButton = () => {
    if (areAllActiveTodos) {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => changeTodoSatus(todo));
    } else {
      todos.forEach(todo => changeTodoSatus(todo));
    }
  };

  const updateTitle = (selectedTodo: Todo, updatedTitle: string) => {
    setErrorType(null);
    setTodoIds(currentTodosIds => [...currentTodosIds, selectedTodo.id]);

    const newTodo = {
      ...selectedTodo,
      title: updatedTitle,
    };

    changeTodo(newTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <ToggleButton
              areAllActiveTodos={areAllActiveTodos}
              onClick={handleToggleButton}
            />
          )}

          <TodoForm
            addTodo={addTodo}
            pending={pending}
            setErrorType={setErrorType}
            todos={todos}
          />
        </header>

        <TodosList
          visibleTodos={shownTodos}
          onDelete={onDelete}
          tempTodo={tempTodo}
          todoIds={todoIds}
          onClick={changeTodoSatus}
          updateTitle={updateTitle}
        />

        {!!todos.length && (
          <TodoFilter
            todos={todos}
            status={status}
            setStatus={setStatus}
            setErrorType={setErrorType}
            onDelete={onDelete}
          />
        )}
      </div>

      {errorType && (
        <ErrorNotifications errorType={errorType} setErrorType={setErrorType} />
      )}
    </div>
  );
};
