/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempAddedTodo, setTempAddedTodo] = useState<Todo | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const shouldFocusCreationForm = useRef(true);

  useEffect(() => {
    shouldFocusCreationForm.current = false;
  }, []);

  const handleError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorMessage.LOAD))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = () => {
    const title = newTodoTitle.trim();

    if (!title) {
      handleError(ErrorMessage.EMPTY);

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempAddedTodo(newTodo);

    return addTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError(ErrorMessage.ADD);
      })
      .finally(() => {
        setIsLoading(false);
        setTempAddedTodo(null);
        shouldFocusCreationForm.current = true;
      });
  };

  const handleFilterChange = useCallback((status: FilterStatus) => {
    setFilterStatus(status);
  }, []);

  const toggleTodo = async (id: number) => {
    setDeletedIds(ids => [...ids, id]);

    await new Promise(resolve => setTimeout(resolve, 50));

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    try {
      const updatedTodoFS = await updateTodo(id, {
        completed: !todoToUpdate.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id
            ? { ...todo, completed: updatedTodoFS.completed }
            : todo,
        ),
      );
    } catch {
      handleError(ErrorMessage.UPDATE);
    } finally {
      setDeletedIds(ids => ids.filter(todoId => todoId !== id));
    }
  };

  const toggleAllTodos = useCallback(async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todosToUpdate.some(t => t.id === todo.id)
            ? { ...todo, completed: !areAllCompleted }
            : todo,
        ),
      );

      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !areAllCompleted }),
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  }, [todos]);

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      handleError(ErrorMessage.DELETE);
    } finally {
      setDeletedIds(ids => ids.filter(id => id !== todoId));
      shouldFocusCreationForm.current = true;
    }
  };

  const handleRenameTodo = async (id: number, newTitle: string) => {
    if (isLoading) {
      return;
    }

    const foundTodo = todos.find(todo => todo.id === id);

    if (!foundTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      return handleDeleteTodo(id);
    }

    if (trimmedTitle === foundTodo.title) {
      return;
    }

    setDeletedIds(ids => [...ids, id]);

    try {
      await updateTodo(id, { title: trimmedTitle });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: trimmedTitle } : todo,
        ),
      );
    } catch {
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? foundTodo : todo)),
      );
      setErrorMessage(ErrorMessage.UPDATE);
      setTimeout(() => setErrorMessage(''), 3000);
      throw new Error('');
    } finally {
      setDeletedIds(ids => ids.filter(todoId => todoId !== id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp" data-cy="TodoApp">
      <h1 className="todoapp__title" data-cy="TodoAppTitle">
        todos
      </h1>
      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleAddTodo={handleAddTodo}
          toggleAllTodos={toggleAllTodos}
          isLoading={isLoading}
          todos={todos}
          shouldFocusCreationForm={shouldFocusCreationForm.current}
          data-cy="Header"
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            visibleTodos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={handleDeleteTodo}
            renameTodo={handleRenameTodo}
            isLoading={isLoading}
            tempAddedTodo={tempAddedTodo}
            deletedIds={deletedIds}
            data-cy="TodoListComponent"
          />
        </section>
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
            handleDeleteTodo={handleDeleteTodo}
            data-cy="Footer"
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage as ErrorMessage}
        data-cy="ErrorNotification"
        aria-live="assertive"
      />
    </div>
  );
};
