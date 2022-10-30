/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from 'react';

import {
  addTodos,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodoList';
import { Filters } from './components/Filters';
import { ErrorNotification, ErrorText } from './components/ErrorNotification';
import { FilterStatus } from './types/Filter';
import { Todo } from './types/Todo';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [title, setTitle] = useState('');
  const [isAdding, setAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorText | null>(null);
  const [isToggle, setIsToggle] = useState(true);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todo;

      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        throw new Error();
    }
  });

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const focusOnInput = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  useEffect(() => {
    focusOnInput();

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setError(ErrorText.Data));
    }
  }, []);

  const hundleAddTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !user) {
      setError(ErrorText.Title);
      setIsToggle(false);

      return;
    }

    setAdding(true);

    try {
      const newTodo = await addTodos(user.id, title);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError(ErrorText.Add);
    } finally {
      setAdding(false);
      focusOnInput();
    }

    setTitle('');
  }, [title, user]);

  const hundleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds([todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorText.Delete);
    }

    setLoadingTodoIds([0]);
  };

  const handleStatusChange = async (
    todoId: number,
    property: Partial<Todo>,
  ) => {
    try {
      const changedTodo: Todo = await updateTodo(todoId, property);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? changedTodo
          : todo
      )));
    } catch {
      setError(ErrorText.Update);
      setIsToggle(false);
    }
  };

  const completedTodosIds = todos.filter(todo => todo.completed);

  const handleClickToggle = async () => {
    if (loadingTodoIds.length === todos.length) {
      setLoadingTodoIds(todos.map(todo => todo.id));
    } else {
      setLoadingTodoIds(todos.filter(todo => !todo.completed)
        .map(todo => todo.id));
    }

    try {
      const newTodos = await Promise.all(todos.map(todo => (
        todo.completed !== isToggle
          ? updateTodo(todo.id, { completed: isToggle })
          : todo
      )));

      setLoadingTodoIds([]);

      setTodos(newTodos);
    } catch {
      setError(ErrorText.Update);
    }

    setIsToggle(!isToggle);
    setLoadingTodoIds([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoField={newTodoField}
          onAddTodo={hundleAddTodo}
          title={title}
          setTitle={setTitle}
          isAdding={isAdding}
          handleToggleAll={handleClickToggle}
        />

        {todos.length > 0 && (
          <>
            <TodosList
              todos={filteredTodos}
              newTitle={title}
              onStatusChange={handleStatusChange}
              onDelete={hundleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              isAdding={isAdding}
            />
            <Filters
              todos={todos}
              filterType={filterStatus}
              handleFilterStatus={setFilterStatus}
              completedTodosIds={completedTodosIds}
              setError={setError}
              setTodos={setTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
