/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import { FilterOption } from './types/Filter';
import { ErrorType } from './types/Error';
import { Loader } from './components/Loader/Loader';
import { filterTodos } from './utils/filter';

export const App: React.FC = () => {
  // #region states

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.noError,
  );
  const [filterField, setFilterField] = useState<FilterOption>(
    FilterOption.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const inputField = useRef<HTMLInputElement>(null);

  // #endregion

  // #region loading data

  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage(ErrorType.loading);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // #endregion

  // #region handling error

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(ErrorType.noError);
  }, []);

  // #endregion

  // #region filtering todos

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterField);
  }, [todos, filterField]);

  const handleFilterBy = useCallback((filter: FilterOption) => {
    setFilterField(filter);
  }, []);

  // #endregion

  // #region adding & deletind todos

  const handleAddTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorType.emptyTitle);

      return false;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await addTodo(newTempTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);

      return true;
    } catch (error) {
      setErrorMessage(ErrorType.adding);

      return false;
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodos(currentTodos => [...currentTodos, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      inputField.current?.focus();
    } catch {
      setErrorMessage(ErrorType.deleting);
    } finally {
      setDeletedTodos(currentTodos => currentTodos.filter(id => id !== todoId));
    }
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [handleDeleteTodo, todos]);

  // #endregion

  // #region updating todos

  const handleUpdateTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      setUpdatingIds(currentTodos => [...currentTodos, todoId]);

      try {
        const updatedTodo = await updateTodo(todoId, data);

        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );

        return true;
      } catch {
        setErrorMessage(ErrorType.updating);

        return false;
      } finally {
        setUpdatingIds(currentTodos =>
          currentTodos.filter(id => id !== todoId),
        );
      }
    },
    [],
  );

  const handleToggleAll = useCallback(
    async (completed: boolean) => {
      const todosToUpdate = todos.filter(todo => todo.completed !== completed);

      if (!todosToUpdate.length) {
        return;
      }

      await Promise.all(
        todosToUpdate.map(todo => handleUpdateTodo(todo.id, { completed })),
      );
    },
    [handleUpdateTodo, todos],
  );

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="todoapp__content">
          <TodoForm
            todos={todos}
            onAddTodo={handleAddTodo}
            isLoading={tempTodo !== null}
            inputField={inputField}
            onToggleAll={handleToggleAll}
          />
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={filteredTodos}
              onDelete={handleDeleteTodo}
              deletedTodos={deletedTodos}
              onUpdate={handleUpdateTodo}
              updatingIds={updatingIds}
              tempTodo={tempTodo}
            />
          </section>
          {todos.length > 0 && (
            <TodoFilter
              todos={todos}
              filterField={filterField}
              onFilter={handleFilterBy}
              onClearCompleted={handleClearCompletedTodos}
            />
          )}
        </div>
      )}
      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
