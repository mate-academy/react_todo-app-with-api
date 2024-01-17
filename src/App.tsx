/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter } from './types/FilterBy';
import { Todo } from './types/Todo';
import {
  createTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/TodoErrorNotification';
import { Errors } from './types/Errors';

const USER_ID = 11629;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const filterTodos = () => {
    switch (filterBy) {
      case Filter.All:
        return todos;

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMessage(Errors.loading));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return setErrorMessage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setIsError(true);

    return createTodo(newTodo)
      .then((finalTodo: Todo) => {
        setTodos(currentTodo => [...currentTodo, finalTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.add))
      .finally(() => {
        setIsError(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(currentTodo => [...currentTodo, todoId]);

    removeTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(Errors.delete))
      .finally(() => setIsLoading(currentTodo => currentTodo
        .filter((id:number) => id !== todoId)));
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(({
      completed,
    }) => completed).map(({ id }) => id);

    const deletePromises = completedTodos.map((id) => removeTodo(id));

    try {
      await Promise.all(deletePromises);

      setTodos((prevTodos) => prevTodos.filter(({
        id,
      }) => !completedTodos.includes(id)));
    } catch (error) {
      setErrorMessage(Errors.delete);
    }
  };

  const handleAllCompleted = () => {
    const isCompleted = todos.every(todo => todo.completed === true);

    setTodos((prevTodos) => {
      const updatedCompletedTodos = prevTodos.map((todo) => ({
        ...todo, completed: !isCompleted,
      }));

      updatedCompletedTodos.forEach((updatedCompletedTodo) => {
        const statusChanged = updatedCompletedTodo.completed
    !== prevTodos.find((todo) => todo.id
    === updatedCompletedTodo.id)?.completed;

        if (statusChanged) {
          setIsLoading((prev) => [...prev, updatedCompletedTodo.id]);

          updateTodo({
            id: updatedCompletedTodo.id,
            completed: updatedCompletedTodo.completed,
          })
            .then((response) => {
              setTodos((prev) => {
                return prev.map((todo) => {
                  if (todo.id === response.id) {
                    return response as Todo;
                  }

                  return todo;
                });
              });
            })
            .catch(() => setErrorMessage(Errors.update))
            .finally(() => {
              setIsLoading((current) => current.filter((id: number) => id
              !== updatedCompletedTodo.id));
            });
        }
      });

      return updatedCompletedTodos;
    });
  };

  const handleActiveTodo = (todoId: number) => {
    const isActive = todos.find((todo) => todo.id === todoId);

    if (isActive) {
      setIsLoading(prev => {
        return [...prev, todoId];
      });
      updateTodo({
        id: todoId,
        completed: !isActive.completed,
      })
        .then((response) => {
          setTodos(prevTodos => {
            return prevTodos.map((todo) => {
              if (todo.id === response.id) {
                return response as Todo;
              }

              return todo;
            });
          });
        })
        .catch(() => setErrorMessage(Errors.update))
        .finally(() => {
          setIsLoading(current => current.filter((
            id: number,
          ) => id !== todoId));
        });
    }
  };

  const handleEdit = async (todo: Todo) => {
    setIsLoading((current) => [...current, todo.id]);
    try {
      const actualTodo = await updateTodo(todo);

      setTodos((prev) => prev.map((el) => (todo.id === el.id
        ? actualTodo as Todo
        : el)));
    } catch (error) {
      setErrorMessage(Errors.update);
    } finally {
      setIsLoading((current) => current.filter((id) => id !== todo.id));
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
          isDisable={isError}
          onHandleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          handleAllCompleted={handleAllCompleted}
        />
        {todos.length > 0 && (
          <TodoList
            todos={filterTodos()}
            deleteTodo={deleteTodo}
            isLoading={isLoading}
            tempTodo={tempTodo}
            handleEdit={handleEdit}
            handleActiveTodo={handleActiveTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
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
