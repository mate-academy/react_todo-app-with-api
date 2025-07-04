import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import { Todo } from 'types/Todo';
import { FilteredBy } from 'types/filteredBy';

import { errorNotification } from 'constants/errors';
import {
  deleteTodo,
  getTodos,
  USER_ID,
  updateTodo,
  addTodos,
} from './api/todos';
import { filterTodos } from 'helpers/filter';

import { FooterTodo } from 'components/FooterTodo';
import { HeaderTodo } from 'components/HeaderTodo';
import { TodoList } from 'components/TodoList';
import { ErrorNotification } from 'components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [filteredBy, setFilteredBy] = useState(FilteredBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTempTodoCreating, setIsTempTodoCreating] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputField = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number): Promise<void> => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(errorNotification.delete);
      throw error;
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
      inputField.current?.focus();
    }
  };

  const showTitleError = () => {
    setErrorMessage(errorNotification.title);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleAddTodo = async (todo: Todo): Promise<boolean> => {
    const newTodo = {
      ...todo,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsTempTodoCreating(true);

    try {
      const created = await addTodos(newTodo);

      setTodos(prev => [...prev, created]);

      return true;
    } catch (error) {
      setErrorMessage(errorNotification.add);

      return false;
    } finally {
      setTempTodo(null);
      setIsTempTodoCreating(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsTodosLoading(true);
        setErrorMessage('');

        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(errorNotification.load);
      } finally {
        setIsTodosLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filteredBy);

  const toggleTodo = async (updatedTodo: Todo): Promise<void> => {
    try {
      const todoToUpdate = await updateTodo({
        ...updatedTodo,
        completed: !updatedTodo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoToUpdate.id ? todoToUpdate : todo,
        ),
      );
    } catch {
      setErrorMessage(errorNotification.update);
    }
  };

  const toggleAllTodos = () => {
    const shouldCompleteAll = !todos.every(todo => todo.completed);
    const prevTodos = [...todos];
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: shouldCompleteAll,
    }));

    setTodos(updatedTodos);

    updatedTodos
      .filter((todo, index) => todo.completed !== todos[index].completed)
      .forEach(todo => {
        updateTodo(todo).catch(() => {
          setTodos(prevTodos);

          setErrorMessage(errorNotification.update);
        });
      });
  };

  const renameTodo = async (todoToUpdate: Todo): Promise<void> => {
    try {
      const updatedTodo = await updateTodo({ ...todoToUpdate });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(errorNotification.update);
      throw error;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          onInvalidTitle={showTitleError}
          isTempTodoCreating={isTempTodoCreating}
          inputField={inputField}
          toggleAllTodos={toggleAllTodos}
          onAddTodo={handleAddTodo}
        />

        {!isTodosLoading && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            isTempTodoCreating={isTempTodoCreating}
            isLoading={isTodosLoading}
            handleDelete={handleDelete}
            deletingTodoIds={deletingTodoIds}
            toggleTodo={toggleTodo}
            renameTodo={renameTodo}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <FooterTodo
            todos={todos}
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onCloseNotification={setErrorMessage}
      />
    </div>
  );
};
