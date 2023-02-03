/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getFilteredTodos } from './api/functions';
import {
  addTodo, getTodos, deleteTodo, changeTodo,
} from './api/todos';
import { AppFooter } from './components/AppFooter/AppFooter';
import { AppHeader } from './components/AppHeader/AppHeader';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<Filter>('All');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const showError = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todo'));
    }
  }, []);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, statusFilter)
  ), [todos, statusFilter]);

  const addingNewTodo = async (dataFromTodo: Omit<Todo, 'id'>) => {
    try {
      setTempTodo({
        id: 0,
        ...dataFromTodo,
      });

      setIsAdding(true);

      const todoForAdding = await addTodo(dataFromTodo);

      setTodos(prevTodos => [...prevTodos, todoForAdding]);
    } catch {
      showError('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const removeTodo = useCallback(
    ((selectedTodoId: number) => {
      setLoadingTodosIds((currentTodosIds) => (
        [...currentTodosIds, selectedTodoId]
      ));

      deleteTodo(selectedTodoId)
        .then(() => (
          setTodos((currentTodos) => currentTodos.filter(
            todo => todo.id !== selectedTodoId,
          ))
        ))
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => {
          setLoadingTodosIds([]);
        });
    }), [],
  );

  const completedTodosLength = useMemo(() => (
    todos.filter(
      todo => todo.completed,
    ).length
  ), [todos]);

  const isAllCompleted = completedTodosLength === todos.length;

  const updateTodo = useCallback(async (
    todoId: number,
    dataToUpdate: Partial<Todo>,
  ) => {
    setLoadingTodosIds((currentTodosIds) => (
      [...currentTodosIds, todoId]
    ));

    try {
      await changeTodo(
        todoId,
        dataToUpdate,
      );

      setTodos(currentTodos => currentTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...dataToUpdate,
        };
      }));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, []);

  const toggleTodosStatuses = useCallback(() => (
    todos.forEach(todo => {
      const todoNeedToBeUpdated = (!todo.completed && !isAllCompleted)
        || isAllCompleted;

      if (todoNeedToBeUpdated) {
        updateTodo(todo.id, { completed: !todo.completed });
      }
    })
  ), [todos]);

  const amountOfActiveTodos = useMemo(() => (
    todos.filter(
      todo => !todo.completed,
    ).length
  ), [todos]);

  const clearCompletedTodos = useCallback(
    () => {
      todos.forEach(todo => {
        if (todo.completed) {
          removeTodo(todo.id);
        }
      });
    }, [todos],
  );

  const onCloseError = useCallback(() => (
    showError('')
  ), []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AppHeader
          lengthOfTodos={todos.length}
          isAllCompleted={isAllCompleted}
          showError={showError}
          addingNewTodo={addingNewTodo}
          isAdding={isAdding}
          toggleTodosStatuses={toggleTodosStatuses}
        />

        {(todos.length !== 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              onTodoDelete={removeTodo}
              tempTodo={tempTodo}
              loadingTodosIds={loadingTodosIds}
              updateTodo={updateTodo}
            />

            <AppFooter
              amountOfActiveTodos={amountOfActiveTodos}
              completedTodosLength={completedTodosLength}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onCloseError={onCloseError}
      />
    </div>
  );
};
