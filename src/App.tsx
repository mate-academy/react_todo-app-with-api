/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import { filterTodos } from './utils/filterTodos';
import { Footer } from './components/Footer';
import { replaceTodo } from './utils/replaceTodo';
import { AddTodoForm } from './components/AddTodoForm';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [searchParams] = useSearchParams();
  const filterBy = searchParams.get('filterBy');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, [user]);

  let timerId: ReturnType<typeof setTimeout> | null = null;

  const setErrorWithTimer = useCallback((title: string) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    setErrorMessage(title);
    setIsError(true);
    timerId = setTimeout(() => setIsError(false), 3000);
  }, []);

  const addHandler = useCallback((title: string) => {
    if (user) {
      const newTodoId = Math.random();
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      setIsError(false);
      setIsFormDisabled(true);
      setLoadingTodoIds(prev => [...prev, newTodoId]);
      setTodos(prev => [...prev, {
        ...newTodo,
        id: newTodoId,
      }]);

      const newTodoIndex = todos.findIndex(({ id }) => id === newTodoId);

      addTodo(newTodo)
        .then((addedTodo) => setTodos(prev => (
          replaceTodo(prev, newTodoIndex, addedTodo)
        )))
        .catch(() => {
          setErrorWithTimer('Unable to create a todo');
          setTodos(prev => (
            replaceTodo(prev, newTodoIndex)
          ));
        })
        .finally(() => {
          setLoadingTodoIds(prev => prev.filter(id => id === newTodoId));
          setNewTodoTitle('');
          setIsFormDisabled(false);
        });
    }
  }, []);

  const deleteHandler = useCallback((todoId: number) => {
    setIsError(false);
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        setErrorWithTimer('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(el => el !== todoId));
      });
  }, []);

  const updateHandler = useCallback((todoId: number, data: Partial<Todo>) => {
    setIsError(false);
    setLoadingTodoIds(prev => [...prev, todoId]);

    updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo => {
          return todo.id === todoId
            ? updatedTodo
            : todo;
        }));
      })
      .catch(() => {
        setErrorWithTimer('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(el => el !== todoId));
      });
  }, []);

  const completeAll = useCallback(() => {
    const newCompleted = todos.some(({ completed }) => !completed);

    todos.forEach(({ id, completed }) => {
      if (completed !== newCompleted) {
        updateHandler(id, { completed: newCompleted });
      }
    });
  }, [todos]);

  const clearCompleted = useCallback(() => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        deleteHandler(id);
      }
    });
  }, [todos]);

  const filteredTodos = useMemo(() => (
    filterTodos(todos, filterBy)
  ), [filterBy, todos]);

  const itemsLeft = useMemo(() => (
    filterTodos(todos, 'active').length
  ), [filterTodos, todos]);
  const completedTodosAmount = useMemo(() => (
    todos.length - itemsLeft
  ), [todos, itemsLeft]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
              onClick={completeAll}
            />
          )}

          <AddTodoForm
            onAdd={addHandler}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            isDisabled={isFormDisabled}
            setErrorWithTimer={setErrorWithTimer}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              isLoading={loadingTodoIds.includes(todo.id)}
              onDelete={deleteHandler}
              onUpdate={updateHandler}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            clearCompleted={clearCompleted}
            completedTodosAmount={completedTodosAmount}
          />
        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />

          {errorMessage}
        </div>
      )}
    </div>
  );
};
