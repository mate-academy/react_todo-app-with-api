import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { ErrorMessages, Filters, LoadingType, Todo } from './types';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { handleFilteredTodos, makeLoadingObject } from './utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [loadingIds, setLoadingIds] = useState<LoadingType>({});

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
      });
  }, []);

  const handleAddTodo = (newTodo: Todo): Promise<Todo | void> => {
    setTempTodo(newTodo);

    return addTodo(newTodo).then(newTodoRes => {
      setTodos(prevTodos => [...prevTodos, newTodoRes]);
    });
  };

  const updateCompletedTodo = (
    updatedTodo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => {
    return updateTodo({ ...updatedTodo, [key]: value })
      .then((updatedTodoFromServer: Todo) => {
        setTodos(prevTodos => {
          return prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodoFromServer : todo,
          );
        });

        return false;
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UpdateError);

        return true;
      });
  };

  const handleToggleTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const activeTodosIds = makeLoadingObject(activeTodos);

    if (activeTodos.length) {
      setLoadingIds(activeTodosIds);

      Promise.all(
        activeTodos.map(todo => updateTodo({ ...todo, completed: true })),
      )
        .then(() =>
          setTodos(prevTodos => {
            return prevTodos.map(todo => {
              if (Object.hasOwn(activeTodosIds, todo.id)) {
                return { ...todo, completed: true };
              } else {
                return todo;
              }
            });
          }),
        )
        .catch(() => setErrorMessage(ErrorMessages.UpdateError))
        .finally(() => setLoadingIds({}));

      return;
    }

    setLoadingIds(makeLoadingObject(todos));
    Promise.all(todos.map(todo => updateTodo({ ...todo, completed: false })))
      .then(() =>
        setTodos(prevTodos => {
          return prevTodos.map(todo => ({ ...todo, completed: false }));
        }),
      )
      .catch(() => setErrorMessage(ErrorMessages.UpdateError))
      .finally(() => setLoadingIds({}));
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingIds(makeLoadingObject(completedTodos));

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(value => {
          if (value.status === 'rejected') {
            setErrorMessage(ErrorMessages.DeleteError);
          } else {
            setTodos(prevTodos => {
              const todoID = value.value as Todo;

              return prevTodos.filter(todo => todo.id !== todoID.id);
            });
          }
        });
      })
      .finally(() => setLoadingIds({}));
  };

  const handleDeleteTodo = (todoID: number): Promise<void> => {
    return deleteTodo(todoID)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoID));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteError);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          tempTodo={tempTodo}
          todos={todos}
          onToggleTodos={handleToggleTodos}
          onChangeTempTodo={setTempTodo}
          onErrorMessage={setErrorMessage}
          onSubmit={handleAddTodo}
        />

        <TodoList
          todos={handleFilteredTodos(todos, filter)}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onEdit={updateCompletedTodo}
          onDelete={handleDeleteTodo}
        />

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            onDeleteCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseErrorMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
