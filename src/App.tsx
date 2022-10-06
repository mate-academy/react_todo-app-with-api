/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [togler, setTogler] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      getTodos(user?.id)
        .then(res => setTodos(res))
        .catch(() => setErrorMessage('Unable to load a todo'));
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [user]);

  const handleAddTodo = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      setErrorMessage('Please write a title');

      return;
    }

    setIsLoading(true);

    setTodos((prev) => ([
      ...prev,
      {
        id: -1,
        userId,
        title: todoTitle,
        completed: false,
      },
    ]
    ));

    addTodo({
      title: todoTitle,
      userId,
      completed: false,
    }).then((newTodo: Todo) => {
      setTodos((prev) => {
        const newState = [...prev];
        const targetTodo = prev
          .findIndex(todo => todo.id === -1);

        if (targetTodo === -1) {
          return prev;
        }

        newState[targetTodo] = newTodo;

        return newState;
      });
    })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTodoTitle('');
        setIsLoading(false);
        setErrorMessage('');
      });
  }, [todoTitle, userId]);

  const handleDeleteTodos = useCallback((todoId: number) => {
    setIsLoading(true);
    setSelectedTodoId(todoId);
    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setTodos((prev) => prev.filter(todo => todo.id !== todoId));
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setErrorMessage('');
      });
  }, []);

  const handleUpdateTodos = useCallback(
    (todoId: number, data: Partial<Todo>) => {
      setIsLoading(true);
      setSelectedTodoId(todoId);
      updateTodo(todoId, data)
        .then(updatedTodo => {
          setTodos(prev => (
            prev.map(todo => (todo.id === todoId
              ? updatedTodo
              : todo))
          ));
        })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setErrorMessage('');
          setIsLoading(false);
        });
    }, [],
  );

  const handleTogleAll = () => {
    todos.forEach(todo => (
      handleUpdateTodos(todo.id, { completed: togler })
    ));
    setSelectedTodoId(0);
    setTogler(!togler);
  };

  const preparedTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn(
              'todoapp__toggle-all',
              {
                active: todos.every(todo => todo.completed),
              },
            )}
            onClick={() => handleTogleAll()}
          />

          <form onSubmit={(event) => handleAddTodo(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {preparedTodos.map(todo => (
              <TodoItem
                todo={todo}
                handleDeleteTodos={handleDeleteTodos}
                handleUpdateTodos={handleUpdateTodos}
                isLoading={isLoading}
                key={todo.id}
                selectedTodoId={selectedTodoId}
              />
            ))}
          </section>
        )}
        <Footer
          todos={preparedTodos}
          filterType={filterType}
          handleFilter={setFilterType}
          handleDeleteTodo={handleDeleteTodos}
        />
      </div>

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
