import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import * as todosService from './api/todos';
import { UserWarning } from './UserWarning';
import { DELAY, USER_ID } from './constans';
import { getTodosByOptions, getToggleAll, getTodos } from './services/todos';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [option, setOption] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[] | null>(null);
  const [updatedTodos, setUpdatedTodos] = useState<Todo[] | null>(null);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, deletedTodosId]);

  const newError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), DELAY);
  };

  const loadTodos = useCallback(() => {
    setErrorMessage('');

    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => newError('Unable to load todos'));
  }, []);

  useEffect(loadTodos, [loadTodos]);

  const addTodo = useCallback(({ userId, completed, title }: Todo) => {
    setErrorMessage('');

    return todosService
      .creatTodo({ userId, completed, title })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => {
        newError('Unable to add a todo');

        throw error;
      })
      .finally(() => setTempTodo(null));
  }, []);

  const deletedTodos = useCallback(
    (todosId: number[]) => {
      setErrorMessage('');
      setLoading(true);
      setDeletedTodosId(todosId);

      const deletedTodosForId = todosId.map(id =>
        todosService
          .deleteTodo(id)
          .then(() => {
            if (selectedTodo) {
              setSelectedTodo(null);
            }

            return setTodos(currentTodo =>
              currentTodo.filter(todo => todo.id !== id),
            );
          })
          .catch(error => {
            newError('Unable to delete a todo');

            throw error;
          }),
      );

      return Promise.allSettled([...deletedTodosForId]).finally(() => {
        setLoading(false);
        setDeletedTodosId(null);
      });
    },
    [selectedTodo],
  );

  const updateTodos = useCallback(
    (todosForUpdate: Todo[]) => {
      setErrorMessage('');
      setLoading(true);
      setUpdatedTodos(todosForUpdate);

      const updateTodosPromise = todosForUpdate.map(todoForUpdate =>
        todosService
          .updateTodo(todoForUpdate)
          .then(newTodo => {
            if (selectedTodo) {
              setSelectedTodo(null);
            }

            setTodos(currentTodos => {
              const newTodos = [...currentTodos];
              const index = newTodos.findIndex(
                todo => todo.id === todoForUpdate.id,
              );

              newTodos.splice(index, 1, newTodo);

              return newTodos;
            });
          })
          .catch(error => {
            if (titleField.current) {
              titleField.current.focus();
            }

            newError('Unable to update a todo');

            throw error;
          }),
      );

      return Promise.allSettled([...updateTodosPromise]).finally(() => {
        setLoading(false);
        setUpdatedTodos(null);
      });
    },
    [selectedTodo],
  );

  const todosByOption = useMemo(
    () => getTodosByOptions(option, todos),
    [option, todos],
  );

  const IsEveryCompletedTodos = useMemo(
    () => getTodos.isEveryCompleted(todos),
    [todos],
  );

  const toggleAll = useCallback(() => getToggleAll(todos), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: IsEveryCompletedTodos,
              })}
              data-cy="ToggleAllButton"
              onClick={() => updateTodos(toggleAll())}
            />
          )}
          <TodoForm
            addTodo={addTodo}
            newError={newError}
            onTempTodo={setTempTodo}
            loading={loading}
            onLoading={setLoading}
            titleField={titleField}
          />
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={todosByOption}
              selectedTodo={selectedTodo}
              onSelectTodo={setSelectedTodo}
              tempTodo={tempTodo}
              onDelete={deletedTodos}
              loading={loading}
              deletedTodosId={deletedTodosId}
              onUpdate={updateTodos}
              updatedTodos={updatedTodos}
              titleField={titleField}
            />

            <TodoFilter
              todos={todos}
              option={option}
              onOption={setOption}
              onDelete={deletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
