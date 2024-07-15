import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { ErrorMessages, Filters, Todo, Loading } from './types';
import { Header } from './components/Header';
import { TodoFooter } from './components/Footer';
import { Error } from './components/Error';
import { loadingObject, filteredTodos } from './utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [loadingId, setLoadingId] = useState<Loading>({});

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToLoad);
      });
  }, []);

  const handleAdd = (newTodo: Todo): Promise<Todo | void> => {
    setTempTodo(newTodo);

    return addTodo(newTodo).then(newTodoRes => {
      setTodos(prevTodos => [...prevTodos, newTodoRes]);
    });
  };

  const updateCompleted = (
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
        setErrorMessage(ErrorMessages.UnableToUpdate);

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
        .catch(() => setErrorMessage(ErrorMessages.UnableToUpdate))
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
      .catch(() => setErrorMessage(ErrorMessages.UnableToUpdate))
      .finally(() => setLoadingId({}));
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingId(loadingObject(completedTodos));

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(value => {
          if (value.status === 'rejected') {
            setErrorMessage(ErrorMessages.UnableToDelete);
          } else {
            setTodos(prevTodos => {
              const todoID = value.value as Todo;

              return prevTodos.filter(todo => todo.id !== todoID.id);
            });
          }
        });
      })
      .finally(() => setLoadingId({}));
  };

  const handleDeleteTodo = (todoID: number): Promise<void> => {
    return deleteTodo(todoID)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoID));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToDelete);
      });
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
          onErrorMessage={setErrorMessage}
          onSubmit={handleAdd}
        />

        <TodoList
          todos={filteredTodos(todos, filter)}
          tempTodo={tempTodo}
          loadingId={loadingId}
          onEdit={updateCompleted}
          onDelete={handleDeleteTodo}
        />

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onCloseErrorMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
