/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { deleteTodos, getTodos, updateTodos, USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Status } from './types/Status';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusOfTodos, setStatusOfTodos] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setloadingIds] = useState<number[]>([]);

  function loadTodos() {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  async function handleDeleteTodo(id: number) {
    setloadingIds(prev => [...prev, id]);
    setloadingIds([id]);

    try {
      await deleteTodos(id);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setloadingIds(prev => prev.filter(todoId => todoId !== id));
    }
  }

  function deleteCompletedTodo() {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => handleDeleteTodo(todo.id));
  }

  const handleUpdateTodo = (
    { id, title, completed }: Todo,
    onSuccess?: VoidFunction,
  ) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return Promise.reject(new Error('Todo not found'));
    }

    const trimmedTitle = title.trim();
    const updatedTodo = {
      ...todoToUpdate,
      title: trimmedTitle,
      completed: completed ?? todoToUpdate.completed,
    };

    setloadingIds(currentId => [...currentId, id]);

    return updateTodos(id, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
        onSuccess?.();
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return Promise.reject(new Error('Update failed'));
      })
      .finally(() => {
        setloadingIds(currentId => currentId.filter(TodoId => TodoId !== id));
      });
  };

  const completedTodos = todos.every(todo => todo.completed);

  const toggleAllButton = async () => {
    const areAllComplete = todos.every(todo => todo.completed);
    const newStatus = !areAllComplete;

    const updatedTodos = todos.map(todo => {
      if (todo.completed !== newStatus) {
        return { ...todo, completed: newStatus };
      }

      return todo;
    });

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setTodos(updatedTodos);
    const updatedIds = todosToUpdate.map(todo => todo.id);

    setloadingIds(prevIds => [...prevIds, ...updatedIds]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodos(todo.id, {
        ...todo,
        completed: newStatus,
      }),
    );

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      setErrorMessage('Unable to update todos');
    } finally {
      setloadingIds(prevIds => prevIds.filter(id => !updatedIds.includes(id)));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          toggleAllButton={toggleAllButton}
          completedTodos={completedTodos}
          setloadingIds={setloadingIds}
          loadingIds={loadingIds}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filterTodos(todos, statusOfTodos)}
            setTodos={setTodos}
            tempTodo={tempTodo}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            handleDeleteTodo={handleDeleteTodo}
            setloadingIds={setloadingIds}
            loadingIds={loadingIds}
            handleUpdateTodo={handleUpdateTodo}
          />
          {!!todos.length && (
            <Footer
              todos={todos}
              setStatusOfTodos={setStatusOfTodos}
              statusOfTodos={statusOfTodos}
              deleteCompletedTodo={deleteCompletedTodo}
            />
          )}
        </section>
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
