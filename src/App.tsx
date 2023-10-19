import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodos,
} from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';

const USER_ID = 11558;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesssage, setErrorMesssage] = useState<string>('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTodoClick = (todoId: number) => {
    const clickedTodo = todos.find((todo) => todo.id === todoId);

    if (clickedTodo) {
      setLoadingItems(prev => {
        return [...prev, todoId];
      });
      updateTodos({
        id: todoId,
        completed: !clickedTodo.completed,
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
        .catch(() => setErrorMesssage(Errors.update))
        .finally(() => {
          setLoadingItems(current => current.filter((
            id: number,
          ) => id !== todoId));
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then((fetchedTodos) => {
        setTodos(fetchedTodos);
      })
      .catch(() => setErrorMesssage(Errors.load))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => [...todos].filter(({ completed }) => {
    if (filter === Filters.All) {
      return true;
    }

    return (filter === Filters.Active)
      ? !completed
      : completed;
  }), [todos, filter]);

  const removeTodo = (todoId: number) => {
    setIsLoading(true);
    setLoadingItems(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(current => current
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMesssage(Errors.delete))
      .finally(() => {
        setIsLoading(false);
        setLoadingItems(current => current.filter((
          id: number,
        ) => id !== todoId));
      });
  };

  const handleEdit = async (todo: Todo) => {
    setLoadingItems(current => [...current, todo.id]);
    try {
      const actualTodo = await updateTodos(todo);

      setTodos((prev) => prev.map((e) => (todo.id === e.id
        ? actualTodo as Todo
        : e
      )));
    } catch (error) {
      setErrorMesssage(Errors.update);
    } finally {
      setLoadingItems(current => current.filter((
        id: number,
      ) => id !== todo.id));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return setErrorMesssage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    setIsDisable(true);

    return addTodo(newTodo)
      .then((resultTodo:Todo) => {
        setTodos(current => [...current, resultTodo]);
        setTitle('');
      })
      .catch(() => setErrorMesssage(Errors.add))
      .finally(() => {
        setIsDisable(false);
        setTempTodo(null);
      });
  };

  const clearCompletedTodos = () => {
    // eslint-disable-next-line max-len
    const completedTodoIds = todos.filter(({ completed }) => completed).map(({ id }) => id);

    completedTodoIds.forEach((id) => removeTodo(id));
  };

  const handleToggleAll = () => {
    const areAllTodosCompleted = todos.every((todo) => todo.completed);

    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => ({
        ...todo,
        completed: !areAllTodosCompleted,
      }));

      updatedTodos.forEach((updatedTodo) => {
        if (updatedTodo.completed
          !== prevTodos.find((t) => t.id === updatedTodo.id)?.completed) {
          setLoadingItems((prev) => [...prev, updatedTodo.id]);

          updateTodos({
            id: updatedTodo.id,
            completed: updatedTodo.completed,
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
            .catch(() => setErrorMesssage(Errors.update))
            .finally(() => {
              setLoadingItems((current) => current.filter((id: number) => id
              !== updatedTodo.id));
            });
        }
      });

      return updatedTodos;
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isDisable={isDisable || isLoading}
          onHandleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          todos={todos}
          handleToggleAll={handleToggleAll}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            loadingItems={loadingItems}
            handleTodoClick={handleTodoClick}
            handleEdit={handleEdit}
          />
        )}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            selectedFilter={filter}
            onSelectedFilter={setFilter}
            errorMessage={errorMesssage}
          />
        )}
      </div>

      <ErrorNotification
        errorMesssage={errorMesssage}
        setErrorMesssage={setErrorMesssage}
      />
    </div>
  );
};
