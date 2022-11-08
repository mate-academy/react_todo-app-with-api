/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';
import { getVisibletodos } from './utils/getVisibleTodos';
import { NewTodoFieldInput } from './components/NewTodoField';
import { TodosCountInfo } from './components/TodosCountInfo/TodosCountInfo';
import { ClearCompletedTodos } from './components/ClearCompletedTodos';
import { TodosFilter } from './components/TodosFilter';
import { TodosList } from './components/TodosList';
import { ErrorNotification } from './components/ErrorNotification';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [processingId, setProcessingId] = useState<number[]>([]);

  const hasTodos = useMemo(() => todos.length > 0, [todos]);
  const hasCompleted = useMemo(() => (
    todos.some(({ completed }) => completed)), [todos]);
  const isAllCompleted = todos.every(({ completed }) => completed);
  const visibleTodos = useMemo(() => (
    getVisibletodos(todos, filterBy)), [todos, filterBy]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const loadTodos = useCallback(async () => {
    if (user) {
      let todosFromApi;

      try {
        todosFromApi = await getTodos(user?.id);
      } catch {
        throw new Error('Todos not found');
      }

      setTodos(todosFromApi);
    }
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => setError(ErrorType.NONE), 3000);
  }, [error]);

  useEffect(() => {
    setError(ErrorType.NONE);
  }, [filterBy]);

  const handleError = (errorType: ErrorType) => {
    setError(errorType);
  };

  const handleAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError(ErrorType.EMPTYTITLE);
    }

    if (user && newTodoTitle.trim()) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: newTodoTitle.trim(),
        completed: false,
      };

      try {
        await addTodo(newTodo);
      } catch {
        setError(ErrorType.ADD);
      }
    }

    await loadTodos();
    setIsAdding(false);
    setNewTodoTitle('');
  }, [newTodoTitle, user]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingId((currentId) => ([
        ...currentId,
        todoId,
      ]));

      await deleteTodo(todoId);
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setProcessingId([]);
    }

    loadTodos();
  }, []);

  const handleDeleteAllCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  }, [todos]);

  const handleNewTodoTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  }, []);

  const handleFilterChange = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  const closeErrorMassege = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const changeTodoStatus = async (todoId: number, status: boolean) => {
    try {
      setProcessingId((currentId) => ([
        ...currentId,
        todoId,
      ]));

      await updateTodo(todoId, status);
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingId([]);
    }
  };

  const handleChangingTodoStatus = async (todoId: number, status: boolean) => {
    await changeTodoStatus(todoId, status);
    loadTodos();
  };

  const changeAllTodosStatus = async () => {
    if (!isAllCompleted) {
      await Promise.all(todos.map(({ id, completed }) => {
        if (!completed) {
          return changeTodoStatus(id, !completed);
        }

        return null;
      }));
    } else {
      await Promise.all(todos.map(({ id, completed }) => {
        return changeTodoStatus(id, !completed);
      }));
    }
  };

  const handleChangingAllTodosStatus = async () => {
    await changeAllTodosStatus();
    await loadTodos();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn(
                'todoapp__toggle-all',
                { active: isAllCompleted },
              )}
              onClick={handleChangingAllTodosStatus}
            />
          )}

          <NewTodoFieldInput
            onError={handleError}
            onAddTodo={handleAddTodo}
            isAdding={isAdding}
            newTodoField={newTodoField}
            newTodoTitle={newTodoTitle}
            onTitleChange={handleNewTodoTitle}
            onStatusChange={changeAllTodosStatus}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodosList
            todos={visibleTodos}
            onUpdate={handleChangingTodoStatus}
            onDelete={onDeleteTodo}
            // deletingIds={deletingIds}
            // changedTodosIds={changedTodosIds}
            processingId={processingId}
          />

          {isAdding && (
            <TempTodo title={newTodoTitle} />
          )}
        </section>

        {(hasTodos || (isAdding && !hasTodos)) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodosCountInfo todos={todos} />
            <TodosFilter
              filterBy={filterBy}
              onFilterChange={handleFilterChange}
            />
            <ClearCompletedTodos
              hasCompleted={hasCompleted}
              onDeleteAllCompleted={handleDeleteAllCompleted}
            />
          </footer>
        )}
      </div>

      <ErrorNotification error={error} onClose={closeErrorMassege} />
    </div>
  );
};
