/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification, ErrorType } from './components/ErrorNotification';
import { TodoInfo } from './components/TodoInfo';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [newTodoLoading, setNewTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, error]);

  const filteredTodo = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [filter, todos]);

  const addTodo = (newTodoTitle: string) => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError('empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    });

    setNewTodoLoading(true);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(curTodos => [...curTodos, newTodo]);

        setQuery('');
      })
      .catch(() => setError('add'))
      .finally(() => {
        setTempTodo(null);
        setNewTodoLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() =>
        setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => setError('delete'));
  };

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [todos]);

  const toggleTodo = (todoId: number, newStatus: boolean) => {
    updateTodo(todoId, { completed: newStatus })
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
          ),
        ),
      )
      .catch(() => {
        setError('update');
      });
  };

  const toggleAll = () => {
    const targetStatus = !todos.every(({ completed }) => completed);

    const todoMark = todos
      .filter(({ completed }) => completed !== targetStatus)
      .map(({ id }) => id);

    todoMark.forEach(todoId => toggleTodo(todoId, targetStatus));
  };

  const changeTodo = (todoId: number, newTodoTitle: string) => {
    updateTodo(todoId, { title: newTodoTitle })
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId
              ? { ...todo, title: newTodoTitle.trim(), isEdit: false }
              : todo,
          ),
        ),
      )
      .catch(() => setError('update'));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAdd={addTodo}
          query={query}
          setQuery={setQuery}
          inputLoading={newTodoLoading}
          inputRef={inputRef}
          toggleAll={toggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodo}
            onDelete={handleDeleteTodo}
            toggleTodo={toggleTodo}
            onChange={changeTodo}
            error={error}
          />
        )}

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            isLoad={true}
            onDelete={handleDeleteTodo}
            toggleTodo={toggleTodo}
            onChange={changeTodo}
            error={error}
          />
        )}

        <Footer
          onFilter={setFilter}
          todos={todos}
          filter={filter}
          clearCompleted={clearCompletedTodos}
        />
      </div>

      <ErrorNotification errorType={error} onClose={handleCloseError} />
    </div>
  );
}
