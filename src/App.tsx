/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [areAllCompleted, setAreAllCompleted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [addTodo, setAddTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allActive = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    setAreAllCompleted(todos.length > 0 && todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resetFocus = () => {
    inputRef.current?.focus();
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.LOAD_TODOS_FAILED);

        setTimeout(clearErrorMessage, 3000);
      });
  }, []);

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleAddTodo = async (title: string) => {
    setAddTodo(true);
    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    try {
      const newTodoFromApi = await postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, newTodoFromApi]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage(ErrorTypes.ADD_TODO_FAILED);
      setNewTodoTitle(title);
      setTimeout(clearErrorMessage, 3000);
    } finally {
      setAddTodo(false);
      setTempTodo(null);
      resetFocus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setLoadingTodos(current => [...current, id]);
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorTypes.DELETE_TODO_FAILED);
      setTimeout(clearErrorMessage, 3000);
      inputRef.current?.focus();
    } finally {
      setLoadingTodos(current => current.filter(todoId => todoId !== id));
      resetFocus();
    }
  };

  const clearCompletedTodos = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await Promise.all(completedIds.map(id => handleDeleteTodo(id)));
  };

  const handleTodoChange = async (id: number, data: { completed: boolean }) => {
    setLoadingTodos(current => [...current, id]);

    setErrorMessage(null);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorTypes.UPDATE_TODO_FAILED);
      setTimeout(clearErrorMessage, 3000);
    } finally {
      setLoadingTodos(current => current.filter(todoId => todoId !== id));
    }
  };

  const toggleAllTodos = async () => {
    const currentTodos = [...todos];
    const allCompleted = currentTodos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodos(current => [
      ...current,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, {
            completed: !allCompleted,
          }),
        ),
      );
      setTodos(currTodos =>
        currTodos.map(todo =>
          todosToUpdate.some(t => t.id === todo.id)
            ? { ...todo, completed: !allCompleted }
            : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorTypes.UPDATE_TODO_FAILED);
      setTimeout(clearErrorMessage, 3000);
    } finally {
      setLoadingTodos(current =>
        current.filter(id => !todosToUpdate.find(t => t.id === id)),
      );
    }
  };

  const handleEditTodo = async (
    id: number,
    newTitle: string,
  ): Promise<boolean> => {
    setLoadingTodos(current => [...current, id]);
    try {
      await updateTodo(id, { title: newTitle });
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === id ? { ...todo, title: newTitle } : todo,
        ),
      );

      return true;
    } catch (error) {
      setErrorMessage(ErrorTypes.UPDATE_TODO_FAILED);

      return false;
    } finally {
      setLoadingTodos(current => current.filter(todoId => todoId !== id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          addTodo={addTodo}
          loading={loading}
          setIsLoading={setLoading}
          setErrorMessage={setErrorMessage}
          handleAddTodo={handleAddTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
          toggleAllTodos={toggleAllTodos}
          allCompleted={areAllCompleted}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={getFilteredTodos()}
            onChange={handleTodoChange}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            handleEditTodo={handleEditTodo}
            inputRef={inputRef}
            loadingTodos={loadingTodos}
            isLoading={loading}
          />
        )}

        {todos.length > 0 && (
          <Footer
            allActive={allActive}
            filter={filter}
            setFilter={setFilter}
            totalTodos={todos.length}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
