/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import * as api from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [, setState] = useState(0);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [filter, setFilter] = useState<Filter>(Filter.all);

  const [processing, setProcessing] = useState<number[]>([]);

  const formField = useRef<HTMLInputElement>(null);

  // #region errors
  const timeoutId = useRef(0);

  const hideError = useCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(setShowErrorMessage, 3000, false);
  }, []);

  const showError = useCallback(
    (message: string) => {
      hideError();
      setShowErrorMessage(true);
      setErrorMessage(message);
    },
    [hideError],
  );
  // #endregion

  // #region useEffect
  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  // #region adding
  const addTodo = useCallback(
    async (title: string) => {
      const newTodo: Todo = {
        id: 0,
        userId: api.USER_ID,
        title: title,
        completed: false,
      };

      setTempTodo(newTodo);

      try {
        const loadedTodo = await api.createTodo(newTodo);

        setTodos(prevTodos => {
          return [...prevTodos, loadedTodo];
        });
      } catch (e) {
        showError('Unable to add a todo');

        throw e;
      } finally {
        setTempTodo(null);
      }
    },
    [showError],
  );
  // #endregion

  // #region updating
  const processToggling = useCallback(
    (toggledTodoIds: number[], data: Partial<Todo>) => {
      Promise.allSettled(
        toggledTodoIds.map(todoId =>
          api.updateTodo(todoId, data).then(() => todoId),
        ),
      ).then(results => {
        setTodos(prevTodos => {
          let isErrorVisible = false;

          for (const result of results) {
            if (result.status === 'rejected') {
              if (!isErrorVisible) {
                isErrorVisible = true;
                showError('Unable to update a todo');
              }

              continue;
            }

            const todoId = result.value;
            const foundTodo = prevTodos.find(todo => todo.id === todoId);

            if (foundTodo) {
              Object.assign(foundTodo, data);
            }
          }

          setProcessing([]);
          formField.current?.focus();

          return [...prevTodos];
        });
      });
    },
    [showError],
  );

  const toggleAll = useCallback(
    (activeCount: number) => {
      setTodos(prevTodos => {
        const toggledTodoIds = prevTodos
          .filter(todo => todo.completed !== !!activeCount)
          .map(todo => todo.id);

        setProcessing(toggledTodoIds);
        processToggling(toggledTodoIds, { completed: !!activeCount });

        return [...prevTodos];
      });
    },
    [processToggling],
  );

  const updateTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      try {
        await api.updateTodo(todoId, data);

        setTodos(prevTodos => {
          const foundTodo = prevTodos.find(todo => todo.id === todoId);

          if (foundTodo) {
            Object.assign(foundTodo, data);
            setState(prevState => prevState + 1);

            if (filter !== Filter.all) {
              return [...prevTodos];
            }
          }

          return prevTodos;
        });
      } catch (e) {
        showError('Unable to update a todo');

        throw e;
      }
    },
    [filter, showError],
  );
  // #endregion

  // #region filtering
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.all:
        return todos;

      case Filter.active:
        return todos.filter(todo => !todo.completed);

      case Filter.completed:
        return todos.filter(todo => todo.completed);
    }
  }, [todos, filter]);
  // #endregion

  // #region deletion
  const deleteTodo = useCallback(
    async (todoId: number) => {
      try {
        await api.deleteTodo(todoId);

        formField.current?.focus();
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch (e) {
        showError('Unable to delete a todo');

        throw e;
      }
    },
    [showError],
  );

  const processDeletion = useCallback(
    (completedTodoIds: number[]) => {
      Promise.allSettled(
        completedTodoIds.map(todoId =>
          api.deleteTodo(todoId).then(() => todoId),
        ),
      ).then(results => {
        setTodos(prevTodos => {
          let isErrorVisible = false;

          for (const result of results) {
            if (result.status === 'rejected') {
              if (!isErrorVisible) {
                isErrorVisible = true;
                showError('Unable to delete a todo');
              }

              continue;
            }

            const todoId = result.value;
            const index = prevTodos.findIndex(todo => todo.id === todoId);

            prevTodos.splice(index, 1);
          }

          setProcessing([]);
          formField.current?.focus();

          return [...prevTodos];
        });
      });
    },
    [showError],
  );

  const deleteCompleted = useCallback(() => {
    setTodos(prevTodos => {
      const completedTodoIds = prevTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessing(completedTodoIds);
      processDeletion(completedTodoIds);

      return prevTodos;
    });
  }, [processDeletion]);
  // #endregion

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          totalCount={todos.length}
          activeCount={activeCount}
          formField={formField}
          onSubmit={addTodo}
          toggleAll={toggleAll}
          showError={showError}
          setShowErrorMessage={setShowErrorMessage}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processing={processing}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        {todos.length !== 0 && (
          <Footer
            totalCount={todos.length}
            activeCount={activeCount}
            clearCompleted={deleteCompleted}
            currentFilter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </div>
  );
};
