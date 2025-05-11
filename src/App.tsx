import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, updateTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';

import { Filter } from './types/FilterType';
// import './App.scss';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredField, setFilteredField] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onAdd = (title: string) => {
    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    });

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    return createTodo(newTodo)
      .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const onDelete = (id: number) => {
    setIsTodoDeleting(true);
    setProcessings(prevTodos => [...prevTodos, id]);

    deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(
        () => (
          setIsTodoDeleting(false),
          setProcessings(prevTodos => prevTodos.filter(todoId => todoId !== id))
        ),
      );
  };

  const onDeleteAllCompleted = async () => {
    if (isTodoLoading) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    let error = false;

    setIsTodoLoading(true);

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);

            setTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );
          } catch {
            setErrorMessage(ErrorMessage.UnableToDelete);
            error = true;
          }
        }),
      );
    } catch {
      setErrorMessage(ErrorMessage.UnableToClear);
    } finally {
      setIsTodoLoading(false);
      if (!error) {
        setErrorMessage(ErrorMessage.Default);
      }

      inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    setIsTodoLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      })
      .finally(() => setIsTodoLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filteredField) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default: //Filter.All
        return true;
    }
  });

  const toggleTodoStatus = async (id: number, completed: boolean) => {
    setLoadingTodoId(id);

    try {
      await updateTodo(id, { completed });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === id ? { ...todo, completed } : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.UnableToUpdate);
    } finally {
      setLoadingTodoId(null);

      inputRef?.current?.focus();
    }
  };

  const toggleAllTodos = async () => {
    if (isTodoLoading) {
      return;
    }

    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== !areAllCompleted,
    );

    setIsTodoLoading(true);

    try {
      await Promise.all(
        todosToUpdate.map(async todo => {
          await updateTodo(todo.id, { completed: !areAllCompleted });
        }),
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => ({
          ...todo,
          completed: !areAllCompleted,
        })),
      );
    } catch {
      setErrorMessage(ErrorMessage.UnableToUpdate);
    } finally {
      setIsTodoLoading(false);
    }
  };

  const editTodo = async (todoId: number, newTitle: string) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, title: newTitle } : todo,
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onAdd={onAdd}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          isInputDisabled={!!tempTodo}
          isTodoLoading={isTodoLoading}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDelete}
          isTodoLoading={isTodoLoading}
          isTodoDeleting={isTodoDeleting}
          processings={processings}
          toggleTodoStatus={toggleTodoStatus}
          editTodo={editTodo}
          setErrorMessage={setErrorMessage}
          loadingTodoId={loadingTodoId}
        />
        {todos.length > 0 && (
          <Footer
            filterField={filteredField}
            setFilteredField={setFilteredField}
            todos={todos}
            onDeleteAllCompleted={onDeleteAllCompleted}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
