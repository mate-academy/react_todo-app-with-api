/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { TodoError } from './types/TodoError';
import * as todoServices from './api/todos';
import { Filter } from './types/Filter';
import { getPraperedTodos } from './services/todos';
import { TodoList } from './components/TodoList';

const USER_ID = 11968;

export const App: React.FC = () => {
  // #region STATE
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<TodoError>(TodoError.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  // #endregion

  const visibleTodos = useMemo(() => getPraperedTodos(todos, filter), [todos, filter]);
  const activeTodos = useMemo(() => getPraperedTodos(todos, Filter.ACTIVE), [todos]);

  // #region HANDLER
  const handleFilterChange = (v: Filter) => setFilter(v);

  const handleErrorMsg = (er: TodoError) => (() => setErrorMsg(er));
  // #endregion

  // #region load, add, update, delete
  const loadTodos = (userId: Todo['id']) => {
    return todoServices.getTodos(userId)
      .then(setTodos)
      .catch(handleErrorMsg(TodoError.LOAD));
  };

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
    return todoServices.deleteTodo(todoId)
      .then(() => {
        setTodos(crntTodos => crntTodos.filter(todo => todo.id !== todoId));
      })
      .catch(handleErrorMsg(TodoError.UNABLE_DELETE));
  };

  const updateTodo = (updatedTodo: Todo) => {
    const { id: todoId, ...rest } = updatedTodo;
    return todoServices.updateTodo(todoId, rest)
      .then((todoFromServer: Todo) => {
        setTodos(crntTodos => crntTodos.map((todo) => {
          return todo.id !== todoFromServer.id ? todo : todoFromServer;
        }));
      })
      .catch(handleErrorMsg(TodoError.UNABLE_UPDATE));
  };
  // #endregion

  // #region EFFECT
  useEffect(() => {
    setIsLoading(true);

    loadTodos(USER_ID)
      .finally(() => setIsLoading(false));
  }, []);
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
          onErrorCreate={(errMsg: TodoError) => setErrorMsg(errMsg)}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
            />

            <TodoFooter
              filter={filter}
              onFilterChange={handleFilterChange}
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
