/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line no-console

import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import { getTodos, USER_ID, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { Header } from './components/Header';
import { FilterType } from './enums/enums';
import { useTodoForm } from './hooks/useTodoForm';

import * as Constants from './hooks/constants';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const [isTodoEditing, setIsTodoEditing] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<number>(0);

  const showErrorContainer = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const fetchedTodos = await getTodos();

        const todosWithLoading = fetchedTodos.map(todo => ({
          ...todo,
          isLoading: false,
        }));

        setTodos(todosWithLoading);
      } catch (e) {
        showErrorContainer('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const incompleteCount = todos.filter(todo => !todo.completed).length;

  const todosCompleted = todos.some(todo => todo.completed);
  const {
    newTodoTitle,
    isAddingTodo,
    tempTodo,
    inputRef,
    handleNewTodoSubmit,
    handleNewTodoTitleChange,
  } = useTodoForm({ setTodos, showErrorContainer });

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const handleHideError = () => {
    setErrorMessage(null);
  };

  const handleToggleAll = async () => {
    const shouldComplete = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, isLoading: true }
          : todo,
      ),
    );

    const updatePromises = todosToUpdate.map(todo => {
      const updatedTodo = { ...todo, completed: shouldComplete };

      return updateTodo(updatedTodo);
    });

    await Promise.all(updatePromises);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: shouldComplete, isLoading: false }
          : { ...todo, isLoading: false },
      ),
    );
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      showErrorContainer(Constants.DELETE_TODO_ERROR);
    } finally {
      setDeletingTodoId(null);
    }
  };

  const handleEditTodo = async (updatedTodo: Todo) => {
    try {
      await updateTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      showErrorContainer('Unable to update a todo');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };

      await handleEditTodo(updatedTodo);
    } catch {
      showErrorContainer('Unable to update a todo');
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        completedTodos.some(t => t.id === todo.id)
          ? { ...todo, isLoading: true }
          : todo,
      ),
    );

    await Promise.allSettled(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        } catch (error) {
          showErrorContainer(Constants.DELETE_TODO_ERROR);
        }
      }),
    );

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        completedTodos.some(t => t.id === todo.id)
          ? { ...todo, isLoading: false }
          : todo,
      ),
    );

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (errorMessage) {
      setIsTodoEditing(true);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          handleNewTodoSubmit={handleNewTodoSubmit}
          newTodoTitle={newTodoTitle}
          handleNewTodoTitleChange={handleNewTodoTitleChange}
          isAddingTodo={isAddingTodo}
          todos={todos}
          handleToggleAll={handleToggleAll}
        />
        {todos.length !== 0 && (
          <TodoList
            todos={todos}
            filter={filter}
            tempTodo={tempTodo}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleEditTodo={handleEditTodo}
            deletingTodoId={deletingTodoId}
            isTodoEditing={isTodoEditing}
            selectedPostId={selectedPostId}
            setIsTodoEditing={setIsTodoEditing}
            setSelectedPostId={setSelectedPostId}
            showErrorContainer={showErrorContainer}
          />
        )}

        {loading && <p>Loading todos...</p>}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            incompleteCount={incompleteCount}
            filter={filter}
            onFilterChange={handleFilterChange}
            todosCompleted={todosCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
