/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { TodoError } from './types/TodoError';
import * as todoServices from './api/todos';
import { Filter } from './types/Filter';
import { getPraperedTodos } from './services/todos';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11968;

export const App: React.FC = () => {
  // #region STATE
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<TodoError>(TodoError.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [processings, setProcessings] = useState<number[]>([]);
  // #endregion

  const visibleTodos = useMemo(() => getPraperedTodos(todos, filter), [todos, filter]);
  const activeTodos = useMemo(() => getPraperedTodos(todos, Filter.ACTIVE), [todos]);
  const isAnyTodo = !!todos.length;
  const isEachTodoComplete
    = isAnyTodo && todos.every(todo => todo.completed);

  // #region HANDLER
  const handleFilterChange = (v: Filter) => setFilter(v);

  const handleErrorMsg = (todoErr: TodoError) => (
    (err: any) => {
      setErrorMsg(todoErr);
      throw err;
    });
  // #endregion

  // #region load, add, update, delete, addProcessing, removeProcessing
  const addProcessing = (id: number) => {
    setProcessings(crntIds => [...crntIds, id]);
  };

  const removeProcessing = (id: number) => {
    setProcessings(crntIds => crntIds.filter(crntId => crntId !== id));
  };

  const loadTodos = useCallback((userId: Todo['id']) => {
    return todoServices.getTodos(userId)
      .then(setTodos)
      .catch(handleErrorMsg(TodoError.LOAD));
  }, []);

  const addTodo = (todo: Omit<Todo, 'id' | 'userId'>): Promise<Todo | void> => {
    setIsLoading(true);
    setTempTodo({ ...todo, userId: USER_ID, id: 0 });

    return todoServices.createTodo({ ...todo, userId: USER_ID })
      .then(newTodo => {
        setTodos(crntTodos => [...crntTodos, newTodo]);
        setTempTodo(null);
        setIsLoading(false);

        return newTodo;
      })
      .catch(handleErrorMsg(TodoError.UNABLE_ADD));
  };

  const deleteTodo = (todoId: number) => {
    addProcessing(todoId);

    return todoServices.deleteTodo(todoId)
      .then(() => {
        setTodos(crntTodos => crntTodos.filter(todo => todo.id !== todoId));
      })
      .catch(handleErrorMsg(TodoError.UNABLE_DELETE))
      .finally(() => removeProcessing(todoId));
  };

  const updateTodo = (updatedTodo: Todo) => {
    const { id: todoId, ...rest } = updatedTodo;

    addProcessing(todoId);

    return todoServices.updateTodo(todoId, rest)
      .then((todoFromServer: Todo) => {
        setTodos(crntTodos => crntTodos.map((todo) => {
          return todo.id !== todoFromServer.id ? todo : todoFromServer;
        }));
      })
      .catch(handleErrorMsg(TodoError.UNABLE_UPDATE))
      .finally(() => removeProcessing(todoId));
  };

  const toggleAll = () => {
    (isEachTodoComplete ? todos : activeTodos).forEach(todo => {
      updateTodo({ ...todo, completed: !isEachTodoComplete });
    });
  };

  const deleteCompletedTodos = () => {
    getPraperedTodos(todos, Filter.COMPLETED)
      .forEach(todo => deleteTodo(todo.id));
  };
  // #endregion

  // #region EFFECT
  useEffect(() => {
    setIsLoading(true);

    loadTodos(USER_ID)
      .finally(() => setIsLoading(false));
  }, [loadTodos]);
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
          onToggleAll={toggleAll}
          onErrorCreate={(errMsg: TodoError) => setErrorMsg(errMsg)}
          isEachTodoComplete={isEachTodoComplete}
        />

        {isAnyTodo && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  isProcessed={processings.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  key={tempTodo.id}
                  todo={tempTodo}
                  isProcessed
                />
              )}
            </section>

            <TodoFooter
              filter={filter}
              onFilterChange={handleFilterChange}
              onClearCompleted={deleteCompletedTodos}
              quantityActiveTodos={activeTodos.length}
              isAnyTodoComplete={todos.some(todo => todo.completed)}
            />
          </>
        )}
      </div>

      {!isLoading && (
        <ErrorNotification
          errorMsg={errorMsg}
          onErrorDelete={() => setErrorMsg(TodoError.NONE)}
        />
      )}
    </div>
  );
};
