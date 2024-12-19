import React, { useState, useEffect } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';

import { loadingObject } from './utils/loadingObject';
import { filteredTodos } from './utils/filteredTodos';

import { Todo } from './types/Todo';
import { ErrorMessage } from './types/enum/Errors';
import { Loading } from './types/Loading';
import { Filters } from './types/enum/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [loadingId, setLoadingId] = useState<Loading>({});

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setErrorMessage(ErrorMessage.Default),
      3000,
    );

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        clearTimeout(timeoutId);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAdd = (newTodo: Todo): Promise<void> => {
    setTempTodo(newTodo);

    return addTodo(newTodo).then(newTodoRes => {
      setTodos(currentTodos => [...currentTodos, newTodoRes]);
    });
  };

  const updateCompleted = (
    updatedTodo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => {
    return updateTodo({ ...updatedTodo, [key]: value })
      .then((updatedTodoFromServer: Todo) => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodoFromServer : todo,
          );
        });

        return false;
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdate);

        return true;
      });
  };

  const handleToggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const activeTodosIds = loadingObject(activeTodos);

    if (activeTodos.length) {
      setLoadingId(activeTodosIds);

      Promise.all(
        activeTodos.map(todo => updateTodo({ ...todo, completed: true })),
      )
        .then(() =>
          setTodos(currentTodos => {
            return currentTodos.map(todo => {
              if (Object.hasOwn(activeTodosIds, todo.id)) {
                return { ...todo, completed: true };
              } else {
                return todo;
              }
            });
          }),
        )
        .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
        .finally(() => setLoadingId({}));

      return;
    }

    setLoadingId(loadingObject(todos));
    Promise.all(todos.map(todo => updateTodo({ ...todo, completed: false })))
      .then(() =>
        setTodos(prevTodos => {
          return prevTodos.map(todo => ({ ...todo, completed: false }));
        }),
      )
      .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
      .finally(() => setLoadingId({}));
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingId(loadingObject(completedTodos));

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(val => {
          if (val.status === 'rejected') {
            setErrorMessage(ErrorMessage.UnableToDelete);
          } else {
            setTodos(currentTodos => {
              const todoId = val.value as Todo;

              return currentTodos.filter(todo => todo.id !== todoId.id);
            });
          }
        });
      })
      .finally(() => setLoadingId({}));
  };

  const handleDelete = (todoId: number): Promise<void> => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() => setTempTodo(null));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          todos={todos}
          onToggleAll={handleToggleAll}
          onChangeTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          onSubmit={handleAdd}
        />

        <TodoList
          todos={filteredTodos(todos, filter)}
          tempTodo={tempTodo}
          loadingId={loadingId}
          onEdit={updateCompleted}
          onDelete={handleDelete}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            selectedFilter={filter}
            onFilteredStatus={setFilter}
            onDeleteCompleted={handleDeleteCompleted}
            setLoadingId={setLoadingId}
          />
        )}
      </div>

      <Errors
        message={errorMessage}
        clearError={() => setErrorMessage(ErrorMessage.Default)}
      />
    </div>
  );
};
