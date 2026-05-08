/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from '../UserWarning';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from '../features/todos/api/todos';
import {
  TodoList,
  TodoHeader,
  TodoFooter,
  ErrorNotification,
  QueryTodos,
  Todo,
} from '../features/todos';
import { filterTodos } from '../features/todos/utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [titleTodo, setTitleTodo] = useState('');

  const [todoInputIsActive, setTodoInputIsActive] = useState(true);

  const activeTodosCount = filterTodos(todos, QueryTodos.Active).length;
  const completedTodos = filterTodos(todos, QueryTodos.Completed);

  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState<QueryTodos>(QueryTodos.All);

  const preparedTodos = filterTodos(todos, query);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      })
      .finally(() => setIsLoading(false));
  }

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setTodoInputIsActive(false);
    setTempTodo({ id: 0, title, userId, completed });

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setTodoInputIsActive(true);
      });
  }

  useEffect(() => {
    if (todoInputIsActive) {
      inputRef.current?.focus();
    }
  }, [todoInputIsActive]);

  function deleteTodo(todoId: number) {
    setUpdatingTodos(prev => [...prev, todoId]);

    return removeTodo(todoId)
      .then(() => {
        inputRef.current?.focus();
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setUpdatingTodos(prev => prev.filter(todo => todo !== todoId));
      });
  }

  function updateTodoTitle(todoId: number, todoTitle: string) {
    const currentTodo = todos.find(todo => todo.id === todoId);
    const fixedTodoTitle = todoTitle.trim();

    if (currentTodo?.title === fixedTodoTitle) {
      setSelectedTodo(null);

      return Promise.resolve();
    }

    if (fixedTodoTitle === '' && currentTodo) {
      deleteTodo(currentTodo.id);

      return Promise.resolve();
    }

    setErrorMessage('');
    setUpdatingTodos(prev => [...prev, todoId]);

    return updateTodo(todoId, { title: fixedTodoTitle })
      .then(updatedTodo => {
        setSelectedTodo(null);

        setTodos(current =>
          current.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setUpdatingTodos(prev => prev.filter(id => id !== todoId));
      });
  }

  function toggleTodoStatus(todoId: number, todoCompleted: boolean) {
    setUpdatingTodos(prev => [...prev, todoId]);
    const todoCompletedReverse = !todoCompleted;

    return updateTodo(todoId, { completed: todoCompletedReverse })
      .then(updatedTodo => {
        setSelectedTodo(null);

        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setUpdatingTodos(prev => prev.filter(todo => todo !== todoId));
      });
  }

  async function toggleAllTodos() {
    const completed = !todos.every(todo => todo.completed);
    const changedTodos = todos.filter(todo => todo.completed !== completed);
    const ids = changedTodos.map(todo => todo.id);

    setUpdatingTodos(prev => [...prev, ...ids]);

    try {
      await Promise.all(
        changedTodos.map(todo =>
          updateTodo(todo.id, {
            completed,
          }),
        ),
      );

      setTodos(current =>
        current.map(todo =>
          todo.completed === completed ? todo : { ...todo, completed },
        ),
      );
    } finally {
      setUpdatingTodos(prev => prev.filter(id => !ids.includes(id)));
    }
  }

  async function clearCompletedTodos() {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    await Promise.all(deletePromises);
    inputRef.current?.focus();
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const handleSubmit = (
    event: React.FormEvent,
    { title, userId, completed }: Omit<Todo, 'id'>,
  ) => {
    event.preventDefault();
    const fixedTitleTodo = title.trim();

    if (!fixedTitleTodo) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({ title: fixedTitleTodo, userId, completed });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          titleTodo={titleTodo}
          toggleAllTodos={toggleAllTodos}
          setTitleTodo={setTitleTodo}
          handleSubmit={handleSubmit}
          todoInputIsActive={todoInputIsActive}
          inputRef={inputRef}
          isLoading={isLoading}
        />

        {!isLoading ? (
          <TodoList
            preparedTodos={preparedTodos}
            deleteTodo={deleteTodo}
            updateTodoTitle={updateTodoTitle}
            toggleTodoStatus={toggleTodoStatus}
            updatingTodos={updatingTodos}
            tempTodo={tempTodo}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
        ) : (
          <div className="todoapp__loader">
            <div className="loader"></div>
          </div>
        )}
        {!isLoading && todos.length !== 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            clearCompletedTodos={clearCompletedTodos}
            query={query}
            setQuery={setQuery}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
