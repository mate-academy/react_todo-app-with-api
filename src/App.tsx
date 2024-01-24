import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { Error } from './components/Error/Error';

const USER_ID = 11984;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isListLoading, setIsListLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');

    todosService.getTodos(USER_ID)
      .then((tasks) => {
        const adTasks = tasks.map(task => ({ ...task, loading: false }));

        setTodos(adTasks);
        setIsListLoading(true);
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToLoad))
      .finally(() => setIsListLoading(false));
  }, []);

  const handleFilterChange = (filter: FilterType) => setSelectedFilter(filter);

  const filterTodos = (filterBy: FilterType, tasks: Todo[]) => {
    switch (filterBy) {
      case FilterType.ACTIVE:
        return tasks.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return tasks.filter(todo => todo.completed);
      default:
        return tasks;
    }
  };

  const visibleTodos = useMemo(() => {
    return filterTodos(selectedFilter, todos);
  }, [todos, selectedFilter]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const unComletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const addTodo = (title: string) => {
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
      loading: true,
    });

    const request = todosService.createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        const addedTodo = {
          ...newTodo,
          loading: false,
        };

        setTodos(currentTodos => [...currentTodos, addedTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });

    return request;
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsListLoading(true);

    setTodos(currentTodos => currentTodos.map(todo => (todo.id === todoId
      ? { ...todo, loading: true } : todo)));

    return todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo
          .filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setIsListLoading(false);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');

    setTodos(currentTodos => currentTodos
      .map(todo => (todo.id === updatedTodo.id
        ? { ...todo, loading: true } : todo)));

    return todosService.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos(currentTodos => currentTodos
          .map(currentTodo => (todo.id === currentTodo.id
            ? todo : currentTodo)));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw error;
      })
      .finally(() => {
        setTodos(currentTodos => currentTodos
          .map(todo => (todo.id === updatedTodo.id
            ? { ...todo, loading: false } : todo)));
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setIsListLoading(true);

    setTodos(currentTodos => currentTodos.map(todo => (todo.completed
      ? { ...todo, loading: true } : todo)));

    const deletePromises = completedTodos
      .map((todo) => todosService.deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .finally(() => {
          setTodos(currentTodos => currentTodos.map(t => (t.id !== todo.id
            ? { ...t, loading: false } : t)));
        }));

    Promise.all(deletePromises)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  };

  const toggleAll = (toggle: boolean) => {
    setErrorMessage('');

    setTodos(currentTodos => currentTodos
      .map(todo => ({ ...todo, loading: true })));

    const toggleTodos = async (tasks: Todo[]) => {
      try {
        const toggeledTodos = tasks.map((todo) => todosService.updateTodo({
          ...todo,
          completed: toggle,
        }));

        const result = await Promise.all(toggeledTodos);

        setTodos(result);
      } catch (error) {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw error;
      } finally {
        setTodos(currentTodos => currentTodos.map(todo => (todo.completed
          ? { ...todo, loading: false } : todo
        )));
        setIsListLoading(false);
      }
    };

    toggleTodos(todos);
  };

  return (
    <>
      {
        USER_ID ? (
          <div className="todoapp">
            <h1 className="todoapp__title">todos</h1>

            <div className="todoapp__content">
              <Header
                todos={todos}
                onSubmit={addTodo}
                error={errorMessage}
                setError={setErrorMessage}
                isListLoading={isListLoading}
                setIsListLoading={setIsListLoading}
                toggleAll={toggleAll}
              />
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                onDelete={deleteTodo}
                updateTodo={updateTodo}
              />

              {todos.length > 0 && (
                <Footer
                  filterBy={selectedFilter}
                  changeFilter={handleFilterChange}
                  completedTodos={completedTodos}
                  unComletedTodos={unComletedTodos}
                  clearCompleted={clearCompleted}
                />
              )}
            </div>

            <Error
              error={errorMessage}
              setError={setErrorMessage}
            />
          </div>
        ) : (
          <UserWarning />
        )
      }
    </>
  );
};
