/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import cn from 'classnames';
import {
  getTodos,
  createTodo,
  removeTodo,
  changeTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { FilterCondition, ErorrMessage } from './types/enums';
import { Header } from './components/Main/Header';
import { TodoList } from './components/Main/TodoList';
import { Footer } from './components/Main/Footer';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(FilterCondition.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  let errorTimer: NodeJS.Timeout;

  const showError = useCallback((message: ErorrMessage) => {
    setIsError(true);
    setErrorMessage(message);

    errorTimer = setTimeout(() => setIsError(() => false), 3000);
  }, []);

  const FilteredTodos = useMemo(() => {
    switch (statusFilter) {
      case FilterCondition.COMPLETED:
        return todos.filter(item => item.completed);

      case FilterCondition.ACTIVE:
        return todos.filter(item => !item.completed);

      case FilterCondition.ALL:
      default:
        return todos;
    }
  }, [todos, statusFilter]);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    const fullTodoData = { ...todoData, userId: user?.id };

    try {
      const temporaryTodo = {
        ...todoData,
        id: 0,
      };

      setTempTodo(temporaryTodo);

      setIsAdding(true);
      const newTodo = await createTodo(fullTodoData);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      showError(ErorrMessage.ON_ADD);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  }, []);

  const deleteTodo = useCallback(async (idToDelete: number) => {
    try {
      setDeletingTodoIds(curr => [...curr, idToDelete]);

      await removeTodo(idToDelete);

      setTodos((currentTodos: Todo[]) => currentTodos
        .filter(task => task.id !== idToDelete));
    } catch {
      showError(ErorrMessage.ON_DELETE);
    } finally {
      setDeletingTodoIds(currId => currId.filter(id => id !== idToDelete));
    }
  }, []);

  const getCompletedTodosId = (allTodos: Todo[]) => {
    const completedTodos = allTodos.filter(todo => todo.completed === true);

    return completedTodos.map(todo => todo.id);
  };

  const deleteCompletedTodos = useCallback(() => {
    const todoIdToDelete = getCompletedTodosId(todos);

    todoIdToDelete.forEach(Id => deleteTodo(Id));
  }, [deleteTodo, todos]);

  const modifyTodo = useCallback(async (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(curr => [...curr, todoId]);

    try {
      const updatedTodo = await changeTodo(todoId, newData);

      setTodos(currentTodo => currentTodo.map(todo => {
        return todo.id === todoId
          ? updatedTodo
          : todo;
      }));
    } catch {
      showError(ErorrMessage.ON_UPDATE);
    } finally {
      setUpdatingTodoIds(currIds => currIds
        .filter(currId => currId !== todoId));
    }
  }, []);

  const isTodosExist = todos.length > 0
    || statusFilter !== FilterCondition.ALL;

  useEffect(() => {
    if (user) {
      getTodos(user?.id)
        .then(setTodos)
        .catch(() => {
          setTodos([]);
          showError(ErorrMessage.ON_UPLOAD);
        });
    }

    return () => {
      window.clearInterval(errorTimer);
    };
  }, [showError, todos.length, user]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={addTodo}
          setIsError={setIsError}
          showError={showError}
          isAdding={isAdding}
          updateTodo={modifyTodo}
        />
        <TodoList
          todos={FilteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          deletingTodoIds={deletingTodoIds}
          updateTodo={modifyTodo}
          updatingTodoIds={updatingTodoIds}

        />

        {isTodosExist && (
          <Footer
            todos={todos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
