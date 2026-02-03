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
import { Todo } from './types/Todo';
import Todos from './components/Todos/Todos';
import TodoHeader from './components/TodoHeader/TodoHeader';
import TodoFooter from './components/TodoFooter/TodoFooter';
import { ErrorMessage, FilterStatus } from './types/enums';
import TodoItem from './components/TodoItem/TodoItem';
import { getVisibleTodos } from './helpers/todoHelpers';
import { CSSTransition } from 'react-transition-group';
import ErrorNotify from './components/ErrorNotify/ErrorNotify';

const TRANSITION_TIMEOUT = 300;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const [errorMsg, setErrorMsg] = useState<ErrorMessage>(ErrorMessage.None);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const errorMsgTimeOutId = useRef<number>(0);
  const createFocusRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (msgType: ErrorMessage) => {
    setErrorMsg(msgType);

    clearTimeout(errorMsgTimeOutId.current);
    errorMsgTimeOutId.current = window.setTimeout(() => {
      setErrorMsg(() => ErrorMessage.None);
    }, 3000);
  };

  useEffect(() => {
    createFocusRef.current?.focus();

    return () => {
      clearTimeout(errorMsgTimeOutId.current);
    };
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  function toggleDisableInput(shouldDisable: boolean = true) {
    if (createFocusRef.current) {
      createFocusRef.current.disabled = shouldDisable;
    }
  }

  const handleTodoDelete = useCallback((todoId: number) => {
    setProcessingTodoIds(ids => [...ids, todoId]);

    toggleDisableInput();

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todoItem => todoItem.id !== todoId));
      })
      .catch(() => {
        handleErrorMessage(ErrorMessage.DeleteTodo);

        return Promise.reject();
      })
      .finally(() => {
        setProcessingTodoIds(ids => ids.filter(id => id !== todoId));
        toggleDisableInput(false);
        createFocusRef.current?.focus();
      });
  }, []);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todoItem => todoItem.completed);

    Promise.all(
      completedTodos.map(completed => {
        return handleTodoDelete(completed.id);
      }),
    );
  };

  const handleTodoAdd = (title: string) => {
    if (!title) {
      handleErrorMessage(ErrorMessage.EmptyTitle);

      return Promise.reject(ErrorMessage.EmptyTitle);
    }

    const todoToAdd: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToAdd);
    toggleDisableInput(true);

    return addTodo(todoToAdd)
      .then(todoResponse => {
        setErrorMsg(() => ErrorMessage.None);
        setTodos(currState => [...currState, todoResponse]);
      })
      .catch(error => {
        handleErrorMessage(ErrorMessage.AddTodo);

        return Promise.reject(error);
      })
      .finally(() => {
        setTempTodo(null);
        toggleDisableInput(false);
        createFocusRef.current?.focus();
      });
  };

  const handleTodoUpdate = useCallback(
    (todo: Todo) => {
      if (!todo.title) {
        return handleTodoDelete(todo.id);
      }

      setProcessingTodoIds(ids => [...ids, todo.id]);

      return updateTodo(todo)
        .then(() =>
          setTodos(currState =>
            currState.map(todoItem =>
              todoItem.id === todo.id ? todo : todoItem,
            ),
          ),
        )
        .catch(error => {
          handleErrorMessage(ErrorMessage.UpdateTodo);

          return Promise.reject(error);
        })
        .finally(() => {
          setProcessingTodoIds(ids => ids.filter(id => id !== todo.id));
        });
    },
    [handleTodoDelete],
  );

  const handleFilterChange = (filter: FilterStatus) => {
    setFilterStatus(filter);
  };

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filterStatus),
    [todos, filterStatus],
  );

  const undoneTodosCount = useMemo(
    () => todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0),
    [todos],
  );

  const isAllTodosCompleted = undoneTodosCount === 0;
  const isAllTodosUncompleted = undoneTodosCount === todos.length;

  const handleToggleAll = () => {
    const todosToUpdate = todos.filter(
      todo => todo.completed === isAllTodosCompleted,
    );

    return Promise.all(
      todosToUpdate.map(todo => {
        return handleTodoUpdate({ ...todo, completed: !isAllTodosCompleted });
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleAll={handleToggleAll}
          onTodoAdd={handleTodoAdd}
          inputRef={createFocusRef}
        />

        <Todos
          todos={visibleTodos}
          handleTodoUpdate={handleTodoUpdate}
          handleTodoRemove={handleTodoDelete}
          processingTodoIds={processingTodoIds}
          transitionTimeout={TRANSITION_TIMEOUT}
        />

        {tempTodo && (
          <CSSTransition timeout={300} classNames={'temp-item'}>
            <TodoItem todo={tempTodo} hasTempTodo={Boolean(tempTodo)} />
          </CSSTransition>
        )}

        {todos.length > 0 && (
          <TodoFooter
            undoneTodosCount={undoneTodosCount}
            isAllTodosUncompleted={isAllTodosUncompleted}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotify
        errorMsg={errorMsg}
        handleErrorMessage={handleErrorMessage}
      />
    </div>
  );
};
