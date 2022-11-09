/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  deleteTodo,
  getTodos,
  updateTodoStatus,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { NewTodoField } from './components/NewTodoField';
import { TodosCountInfo } from './components/TodosCountInfo/TodosCountInfo';
import { ClearCompletedTodos } from './components/ClearCompletedTodos';
import { TodosFilter } from './components/TodosFilter';
import { TodosList } from './components/TodosList';
import { ErrorNotification } from './components/ErrorNotification';
import { ChangeTodosStatusButton } from './components/ChangeTodosStatusButton';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const hasTodos = todos.length > 0;
  const firstTodoIsAdding = isAdding && !hasTodos;
  const hasCompleted = useMemo(() => (
    todos.some(({ completed }) => completed)), [todos]);

  const loadTodos = useCallback(async (): Promise<void> => {
    if (user) {
      try {
        const todosFromApi = await getTodos(user.id);

        setTodos(todosFromApi);
        setVisibleTodos(todosFromApi);
      } catch (e) {
        setError(ErrorType.LOADING);
      }
    }
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, []);

  const onDeleteTodo = useCallback(async (todoId: number): Promise<void> => {
    try {
      setProcessingIds(ids => ([
        ...ids,
        todoId,
      ]));

      await deleteTodo(todoId);
    } catch (e) {
      setError(ErrorType.DELETE);
    } finally {
      setProcessingIds([]);
    }
  }, []);

  const onUpdateTodoStatus = async (
    todoId: number,
    completed: boolean,
  ): Promise<void> => {
    try {
      setProcessingIds(ids => ([
        ...ids,
        todoId,
      ]));

      await updateTodoStatus(todoId, completed);
    } catch (e) {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingIds([]);
    }
  };

  useEffect(() => {
    setTimeout(() => setError(ErrorType.NONE), 3000);
  }, [error]);

  const onChangeVisibleTodos = (newTodos: Todo[]): void => {
    setVisibleTodos(newTodos);
  };

  const onChangeError = (errorType: ErrorType) => {
    setError(errorType);
  };

  const onChangeNewTodoTitle = useCallback((title: string) => {
    setNewTodoTitle(title);
  }, []);

  const closeErrorMassege = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const onChangeIsAdding = (status: boolean) => {
    setIsAdding(status);
  };

  const onChangeProcessingIds = (todoId: number | []) => {
    if (typeof todoId === 'number') {
      setProcessingIds((ids) => ([
        ...ids,
        todoId,
      ]));
    } else {
      setProcessingIds([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <ChangeTodosStatusButton
              todos={visibleTodos}
              onUpdateTodoStatus={onUpdateTodoStatus}
              loadTodos={loadTodos}
            />
          )}

          <NewTodoField
            onChangeError={onChangeError}
            loadTodos={loadTodos}
            isAdding={isAdding}
            onChangeIsAdding={onChangeIsAdding}
            newTodoTitle={newTodoTitle}
            onChangeNewTodoTitle={onChangeNewTodoTitle}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodosList
            todos={visibleTodos}
            onDeleteTodo={onDeleteTodo}
            loadTodos={loadTodos}
            onUpdateTodoStatus={onUpdateTodoStatus}
            processingIds={processingIds}
            isAdding={isAdding}
            newTodoTitle={newTodoTitle}
            onChangeError={onChangeError}
            onChangeProcessingIds={onChangeProcessingIds}
          />
        </section>

        {(hasTodos || firstTodoIsAdding)
          && (
            <footer className="todoapp__footer" data-cy="Footer">
              <TodosCountInfo todos={todos} />
              <TodosFilter
                onChangeVisibleTodos={onChangeVisibleTodos}
                todos={todos}
                onChangeError={onChangeError}
              />

              {hasCompleted && (
                <ClearCompletedTodos
                  todos={visibleTodos}
                  onDeleteTodo={onDeleteTodo}
                  loadTodos={loadTodos}
                />
              )}

            </footer>
          )}
      </div>

      <ErrorNotification
        error={error}
        closeErrorMassege={closeErrorMassege}
      />
    </div>
  );
};
