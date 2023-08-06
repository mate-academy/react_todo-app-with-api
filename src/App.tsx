import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import * as todoServise from './api/todos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { prepareTodos } from './utils/filterTodos';
import { UserWarning } from './UserWarning';
import { TodoError } from './components/TodoError';
import { Error } from './types/Error';

const USER_ID = 6909;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortField, setSortField] = useState(Status.All);
  const [error, setError] = useState(Error.NONE);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveIds, setIsActiveIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.LOAD));
  }, []);

  const filteredTodos = useMemo(() => prepareTodos(
    todos, sortField,
  ), [todos, sortField]);

  const visibleTodos = tempTodo !== null
    ? [...filteredTodos, tempTodo]
    : filteredTodos;

  const toggleTodoCompleted = async (todoId: number) => {
    setIsActiveIds([todoId]);
    setIsLoading(true);
    const todoForUpdate = visibleTodos.find(todo => todo.id === todoId);

    try {
      if (todoForUpdate) {
        await todoServise.updateTodo(
          { ...todoForUpdate, completed: !todoForUpdate.completed }, todoId,
        );
      }

      setTodos(currentTodos => currentTodos.map(
        todo => (todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo),
      ));
    } catch {
      setError(Error.UPDATE);
    } finally {
      setIsLoading(false);
      setIsActiveIds([]);
    }
  };

  const toggleTodoCompletedAll = () => {
    const todoIds = visibleTodos.map(todo => todo.id);

    todoIds.forEach(todoId => {
      toggleTodoCompleted(todoId);
      setIsActiveIds(todoIds);
    });
  };

  const updateTodo = async (todoId: number, updatedTitle: string) => {
    setIsActiveIds([todoId]);
    setIsLoading(true);
    const todoForUpdate = visibleTodos.find(todo => todo.id === todoId);

    try {
      if (todoForUpdate) {
        await todoServise.updateTodo(
          { ...todoForUpdate, title: updatedTitle }, todoId,
        );

        setTodos(currentTodos => currentTodos.map(
          todo => (todo.id === todoId
            ? { ...todo, title: updatedTitle }
            : todo),
        ));
      }
    } catch {
      setError(Error.UPDATE);
    } finally {
      setIsActiveIds([]);
      setIsLoading(false);
      setEditMode(false);
      setSelectedTodo(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todosExist = todos.length > 0;

  function getNotCompletedTodos() {
    return todos.filter(todo => !todo.completed);
  }

  function getCompletedTodos() {
    return todos.filter(todo => todo.completed);
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!todoTitle.trim()) {
      setError(Error.NONE);
    }

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsActiveIds([0]);

    try {
      const todo = await todoServise.createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, todo]);
    } catch {
      setError(Error.ADD);
    } finally {
      setIsLoading(false);
      setIsActiveIds([]);
      setTempTodo(null);
      setTodoTitle('');
    }
  };

  const deleteTodo = async (todoId: number) => {
    setIsLoading(true);
    setIsActiveIds([todoId]);

    try {
      await todoServise.removeTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setTodos(todos);
      setError(Error.DELETE);
      throw err;
    } finally {
      setIsActiveIds([]);
      setIsLoading(false);
      setSelectedTodo(null);
    }
  };

  const clearCompleted = () => {
    const completedTodosIds = getCompletedTodos().map(todo => todo.id);

    completedTodosIds.forEach(todoId => {
      deleteTodo(todoId);
      setIsActiveIds(completedTodosIds);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {filteredTodos.length > 0
            && (
              <button
                type="button"
                className={cn('todoapp__toggle-all', {
                  active: filteredTodos.every(todo => todo.completed),
                })}
                aria-label="toggleButton"
                onClick={() => toggleTodoCompletedAll()}
              />
            )}

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              disabled={isLoading}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {todosExist
          && (
            <>
              <section className="todoapp__main">
                <TodoList
                  onDelete={deleteTodo}
                  isLoading={isLoading}
                  isActiveIds={isActiveIds}
                  tempTodo={tempTodo}
                  toggleTodoCompleted={toggleTodoCompleted}
                  visibleTodos={visibleTodos}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setSelectedTodo={setSelectedTodo}
                  selectedTodo={selectedTodo}
                  updateTodo={updateTodo}
                  // setIsActiveIds={setIsActiveIds}
                />
              </section>

              <Footer
                numberOfCompletedTodos={getCompletedTodos().length}
                numberOfNotCompletedTodos={getNotCompletedTodos().length}
                sortField={sortField}
                setSortField={setSortField}
                clearCompleted={clearCompleted}
              />
            </>
          )}
      </div>

      {error
        && (
          <TodoError
            error={error}
            setError={setError}
          />
        )}
    </div>
  );
};
