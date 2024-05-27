import React, { useEffect, useState } from 'react';

import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { ErrorHandler } from './components/ErrorHandler/ErrorHandler';

import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { SortFields } from './types/sortFields';
import { ErrorTypes } from './types/errorTypes';

import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedField, setSelectedField] = useState(SortFields.default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToLoad);
      });
  }, []);

  function onAddTodo({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!title) {
      setErrorMessage(ErrorTypes.invalidTitle);
      setIsSubmitting(false);

      return Promise.resolve();
    }

    setTempTodo({
      id: 0,
      title: title,
      userId: userId,
      completed: completed,
    });

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  }

  function onDeleteTodo(todoId: number): Promise<void> {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToDelete);
        throw error;
      });
  }

  function onUpdateTodo(
    todoId: number,
    updatedFields: Partial<Todo>,
  ): Promise<void> {
    return updateTodo(todoId, updatedFields)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currTodo => {
            if (currTodo.id === todoId) {
              return { ...currTodo, ...updatedFields };
            }

            return currTodo;
          }),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorTypes.UnableToUpdate);
        throw error;
      });
  }

  const onToggleStatus = (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);
    const todoToUpdate = todos.find(todo => todo.id === id);
    const updatedFields = { completed: !todoToUpdate?.completed };

    onUpdateTodo(id, updatedFields).finally(() => setLoadingIds([]));
  };

  const visibleTodos = getVisibleTodos(todos, selectedField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={onAddTodo}
          isSubmiting={isSubmitting}
          todos={todos}
          toggleStatus={onToggleStatus}
        />

        <Main
          todos={visibleTodos}
          deleteTodo={onDeleteTodo}
          setTodos={setTodos}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          toggleStatus={onToggleStatus}
          updateTodo={onUpdateTodo}
        />

        {tempTodo !== null && (
          <TodoItem todo={tempTodo} isSubmiting={isSubmitting} />
        )}

        {todos.length > 0 && (
          <Footer
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            todos={todos}
            deleteTodo={onDeleteTodo}
            setLoadingIds={setLoadingIds}
          />
        )}
      </div>

      <ErrorHandler
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
