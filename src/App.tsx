/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorMessage, FilterType, Todo } from './types/Types';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [filter, setFilter] = useState(FilterType.All);
  const [inputText, setInputText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.None);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = inputText.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage(ErrorMessage.Title);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    try {
      const newTodoFromServer = await createTodo({
        userId: USER_ID,
        title: normalizedTitle,
        completed: false,
      });

      setTodos([...todos, newTodoFromServer]);
      setInputText('');
    } catch (error) {
      setErrorMessage(ErrorMessage.Add);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
    } finally {
      setTempTodo(null);

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleDelete = async (todoID: number) => {
    setProcessingIds(currentIds => [...currentIds, todoID]);

    try {
      await deleteTodo(todoID);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoID));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoID));

      if (newTodoField.current) {
        setTimeout(() => newTodoField.current?.focus(), 0);
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const promises = completedTodos.map(todo => handleDelete(todo.id));

    await Promise.all(promises);
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    return true;
  });

  const handleToggle = async (todoId: number, completed: boolean) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, { completed });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const handleToggleAll = async () => {
    const shouldBeCompleted = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    const promises = todosToUpdate.map(todo =>
      handleToggle(todo.id, shouldBeCompleted),
    );

    await Promise.all(promises);
  };

  const hasTodos = todos.length > 0;
  const allCompleted = hasTodos && todos.every(todo => todo.completed);

  const handleRename = async (todoId: number, title: string) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, { title });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.Update);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
      throw error;
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isDisabled={!!tempTodo}
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={handleSubmit}
          inputRef={newTodoField}
          onToggleAll={handleToggleAll}
          allCompleted={allCompleted}
          hasTodos={todos.length > 0}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
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
