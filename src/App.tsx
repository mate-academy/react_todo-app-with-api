/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, USER_ID, deleteTodo, editTodo } from './api/todos';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Filter } from './components/Filter/Filter';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isProcessing = processingTodoIds.length > 0;
    const isTempTodo = !!tempTodo;

    if (!isProcessing && !isTempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingTodoIds.length]);

  const loadTodos = async () => {
    setErrorMessage('');

    try {
      const todosFromServer = await getTodos();

      if (!todosFromServer.length) {
        setErrorMessage(ErrorMessage.LoadTodos);
      }

      setTodos(todosFromServer);
    } catch (err) {
      setErrorMessage(ErrorMessage.LoadTodos);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timerId = errorMessage
      ? setTimeout(() => setErrorMessage(''), 3000)
      : null;

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = async (todoTitle: string) => {
    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
      throw error;
    } finally {
      setProcessingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompleted = async () => {
    const idsToDelete = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!idsToDelete.length) {
      return;
    }

    setProcessingTodoIds(current => [...current, ...idsToDelete]);

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const failedIds = results
      .map((result, index) =>
        result.status === 'rejected' ? idsToDelete[index] : null,
      )
      .filter((id): id is number => id !== null);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setProcessingTodoIds(current =>
      current.filter(id => !idsToDelete.includes(id)),
    );
  };

  const handleEditTodo = async (updatedTodo: Todo): Promise<boolean> => {
    const oldTodo = todos.find(todo => todo.id === updatedTodo.id);
    const trimmedTitle = updatedTodo.title.trim();

    if (!oldTodo) {
      return false;
    }

    if (!trimmedTitle) {
      await handleDeleteTodo(updatedTodo.id);
      setErrorMessage(ErrorMessage.EmptyTitle);

      return false;
    }

    if (trimmedTitle === oldTodo.title) {
      return true;
    }

    const todoToUpdate = {
      ...oldTodo,
      title: trimmedTitle,
    };

    setProcessingTodoIds(current => [...current, updatedTodo.id]);

    try {
      const savedTodo = await editTodo(todoToUpdate);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === savedTodo.id ? savedTodo : todo)),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);

      return false;
    } finally {
      setProcessingTodoIds(current =>
        current.filter(id => id !== updatedTodo.id),
      );
    }
  };

  const handleToggleAllTodos = async (newStatus: boolean) => {
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (!todosToUpdate.length) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingTodoIds(current => [...current, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo =>
      editTodo({ ...todo, completed: newStatus }),
    );

    try {
      const results = await Promise.all(updatePromises);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updated = results.find(
            updatedTodo => updatedTodo.id === todo.id,
          );

          return updated ? updated : todo;
        }),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingTodoIds(current =>
        current.filter(id => !idsToUpdate.includes(id)),
      );
    }
  };

  const handleToggleTodoStatus = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setProcessingTodoIds(current => [...current, todo.id]);

    try {
      const savedTodo = await editTodo(updatedTodo);

      setTodos(currentTodos =>
        currentTodos.map(todoItem =>
          todoItem.id === savedTodo.id ? savedTodo : todoItem,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingTodoIds(current => current.filter(id => id !== todo.id));
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
          todos={todos}
          handleToggleAllTodos={handleToggleAllTodos}
          inputRef={inputRef}
          handleAddTodo={handleAddTodo}
          isAddingTodo={!!tempTodo}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={handleDeleteTodo}
          processingTodoIds={processingTodoIds}
          tempTodo={tempTodo}
          handleEditTodo={handleEditTodo}
          inputRef={inputRef}
          onToggleStatus={handleToggleTodoStatus}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Filter
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
