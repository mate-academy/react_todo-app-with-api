/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setTodoTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const newTodoField = useRef<HTMLInputElement>(null);

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
          setTodoTitle('');
          if (newTodoField.current) {
            newTodoField.current.disabled = false;
            newTodoField.current.focus();
          }
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

  const addNewTodoHandler = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (newTodoTitle) {
      if (newTodoField.current) {
        newTodoField.current.disabled = true;
      }

      addHandler(newTodoTitle);
    } else {
      setErrorWithTimer('Title can\'t be empty');
    }
  }, [addHandler, newTodoField, newTodoTitle]);

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

          <form onSubmit={addNewTodoHandler}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
            />
          </form>
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
