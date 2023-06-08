/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';

import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const USER_ID = 10613;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.all);
  const [todoTitle, setTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState(ErrorType.none);

  const hideError = () => {
    setErrorType(ErrorType.none);
  };

  const showError = (value: ErrorType) => {
    setErrorType(value);

    setTimeout(() => {
      hideError();
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError(ErrorType.onLoad);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterStatus) {
        case FilterStatus.active:
          return !todo.completed;

        case FilterStatus.completed:
          return todo.completed;

        case FilterStatus.all:
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      showError(ErrorType.missingTitle);

      return;
    }

    try {
      hideError();

      setIsCreating(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      const todo = await createTodo(USER_ID, todoTitle);

      setTodos([
        ...todos,
        todo,
      ]);

      setTodoTitle('');

      setTempTodo(null);
    } catch {
      showError(ErrorType.onAdd);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setProcessedTodoIds([
        ...processedTodoIds,
        todoId,
      ]);

      hideError();

      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorType.onDelete);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodoIds = todos.filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessedTodoIds(completedTodoIds);

      hideError();

      await Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      showError(ErrorType.onDelete);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleUpdateTodo = async (todoId: number, data: any) => {
    try {
      setProcessedTodoIds([
        ...processedTodoIds,
        todoId,
      ]);

      hideError();

      await updateTodo(todoId, data);

      setTodos(prevTodos => {
        return prevTodos.map(currTodo => {
          if (currTodo.id !== todoId) {
            return currTodo;
          }

          return {
            ...currTodo,
            ...data,
          };
        });
      });
    } catch {
      showError(ErrorType.onUpdate);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleToggleAll = async () => {
    try {
      const notCompletedTodoIds = todos.filter(todo => !todo.completed)
        .map(todo => todo.id);

      hideError();

      if (notCompletedTodoIds.length) {
        setProcessedTodoIds(notCompletedTodoIds);

        await Promise.all(notCompletedTodoIds.map(todoId => {
          return updateTodo(todoId, { completed: true });
        }));

        setTodos(todos.map(todo => ({
          ...todo,
          completed: true,
        })));
      } else {
        const allTodoIds = todos.map(todo => todo.id);

        setProcessedTodoIds(allTodoIds);

        await Promise.all(allTodoIds.map(todoId => {
          return updateTodo(todoId, { completed: false });
        }));

        setTodos(todos.map(todo => ({
          ...todo,
          completed: false,
        })));
      }
    } catch {
      showError(ErrorType.onUpdate);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onFormSubmit={handleFormSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isCreating={isCreating}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          visibleTodos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          processedTodoIds={processedTodoIds}
          tempTodo={tempTodo}
          onUpdateTodo={handleUpdateTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            onSetFilterStatus={setFilterStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Notification
        errorType={errorType}
        onCloseNotification={hideError}
      />
    </div>
  );
};
