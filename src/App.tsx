/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { createTodo } from './api/todos';
import { delTodos } from './api/todos';
import { updateTodoTitle } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { updateTodoStatus } from './api/todos';
import { updateAllTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [isInput, setIsInput] = useState('');
  const [todos, setTodo] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const handleError = (type: string) => {
    setErrorType(type);
    setTimeout(() => setErrorType(null), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodo)
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {});
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (userId, title, completed) => {
    const newTempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(newTempTodo);

    return createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodo(currentTodo => [...currentTodo, newTodo]);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const getFilter = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleRemoveTodo = (todoId: number) => {
    setLoadingTodoId(current => [...current, todoId]);

    delTodos(todoId)
      .then(() => {
        setTodo(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoId(current => current.filter(id => id !== todoId));
      });
  };

  const handleRemoveCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoId(prev => [...prev, ...completedIds]);

    Promise.allSettled(completedTodos.map(todo => delTodos(todo.id)))
      .then(results => {
        const successfullyDeletedIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedIds[index] : null,
          )
          .filter(id => id !== null);

        setTodo(prev =>
          prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        setLoadingTodoId(prev =>
          prev.filter(id => !successfullyDeletedIds.includes(id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          handleError('Unable to delete a todo');
        }
      })
      .catch(() => {
        handleError('Unable to delete todo');
      });
  };

  const handleUpdateTodoChecked = ({
    id,
    completed,
  }: {
    id: number;
    completed: boolean;
  }) => {
    const newStatus = !completed;

    setLoadingTodoId(prev => [...prev, id]);

    updateTodoStatus({ id, completed: newStatus })
      .then(updatedTodo => {
        setTodo(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id
              ? { ...todo, completed: updatedTodo.completed }
              : todo,
          ),
        );
      })
      .catch(() => {
        setTodo(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed } : todo,
          ),
        );
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleUpdateAllTodos = (todoList: Todo[], newStatus: boolean) => {
    const changedTodos = todoList.filter(todo => todo.completed !== newStatus);
    const changedIds = changedTodos.map(todo => todo.id);

    if (changedIds.length === 0) {
      return;
    }

    setLoadingTodoId(prev => [...prev, ...changedIds]);

    const updates = updateAllTodos(changedTodos, newStatus);

    updates.forEach(promise => {
      promise
        .then(({ id }) => {
          setTodo(prevTodos =>
            prevTodos.map(todo =>
              todo.id === id ? { ...todo, completed: newStatus } : todo,
            ),
          );

          setLoadingTodoId(prev => prev.filter(loadingId => loadingId !== id));
        })
        .catch(() => {
          handleError(`Unable to update todo`);
        });
    });
  };

  const handleUpdateTitle = async ({
    id,
    title,
  }: {
    id: number;
    title: string;
  }) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleRemoveTodo(id);

      return;
    }

    setLoadingTodoId(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodoTitle({ id, title: trimmedTitle });

      setTodo(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );
    } catch (error) {
      handleError('Unable to update a todo');
      throw error;
    } finally {
      setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {
          <TodoHeader
            isInput={isInput}
            setIsInput={setIsInput}
            createTodo={addTodo}
            setErrorType={setErrorType}
            handleError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleUpdateAllTodos={handleUpdateAllTodos}
            todos={todos}
          />
        }
        {
          <TodoList
            getFilter={getFilter}
            handleRemoveTodo={handleRemoveTodo}
            tempTodo={tempTodo}
            isLoading={isLoading}
            loadingTodoId={loadingTodoId}
            handleUpdateTodoChecked={handleUpdateTodoChecked}
            handleUpdateTitle={handleUpdateTitle}
            handleError={handleError}
          />
        }

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            setFilter={setFilter}
            isTodo={todos}
            filter={filter}
            handleRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification setErrorType={setErrorType} errorType={errorType} />
    </div>
  );
};
