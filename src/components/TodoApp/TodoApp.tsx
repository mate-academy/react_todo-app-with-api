import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import * as todoServise from '../../api/todos';
import * as getTodos from '../../utils/getTodos';
import { Footer } from '../Footer';
import { TodoList } from '../TodoList';
import { Status } from '../../types/Status';
import { prepareTodos } from '../../utils/filterTodos';
import { UserWarning } from '../../UserWarning';
import { TodoError } from '../TodoError';
import { Error } from '../../types/Error';
import { TodosContext } from '../context/TodosContext';

const USER_ID = 6909;

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    isLoading,
    setIsLoading,
    setIsActiveIds,
    setEditMode,
    setSelectedTodo,
    tempTodo,
    setTempTodo,
  } = useContext(TodosContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [sortField, setSortField] = useState(Status.All);
  const [error, setError] = useState(Error.NONE);
  const [toggleTodosIsActive, setToggleTodosIsActive] = useState(false);

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

  const toggleTodoCompletedAll = async () => {
    const updatedToggleTodosIsActive = !toggleTodosIsActive;

    setToggleTodosIsActive(updatedToggleTodosIsActive);

    const updatedIds = visibleTodos.map(todo => todo.id);

    setIsActiveIds(updatedIds);
    setIsLoading(true);

    try {
      await Promise.all(
        visibleTodos.map(todo => todoServise.updateTodo(
          { ...todo, completed: !toggleTodosIsActive }, todo.id,
        )),
      );
      setTodos(currentTodos => currentTodos.map(
        todo => ({ ...todo, completed: !toggleTodosIsActive }),
      ));
    } catch {
      setError(Error.UPDATE);
    } finally {
      setIsLoading(false);
      setIsActiveIds([]);
    }
  };

  const updateTodoItem = async (todoId: number, updatedTitle: string) => {
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
    const completedTodosIds = getTodos.getCompletedTodos(todos).map(
      todo => todo.id,
    );

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
                onClick={toggleTodoCompletedAll}
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
                  visibleTodos={visibleTodos}
                  updateTodoItem={updateTodoItem}
                  deleteTodo={deleteTodo}
                  toggleTodoCompleted={toggleTodoCompleted}
                />
              </section>

              <Footer
                numberOfCompletedTodos={
                  getTodos.getCompletedTodos(todos).length
                }
                numberOfNotCompletedTodos={
                  getTodos.getNotCompletedTodos(todos).length
                }
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
