import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { taskLoader } from './utils/taskLoader';
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

  const handleFilterChange = useCallback((filter: FilterType) => {
    setSelectedFilter(filter);
  }, []);

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

  const visibleTodos = filterTodos(selectedFilter, todos);
  const completedTodos = todos.filter(todo => todo.completed);
  const unCompletedTodos = todos.filter(todo => !todo.completed);
  const isAllCompleted = todos.length === completedTodos.length;

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

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');

    taskLoader(setTodos, updatedTodo.id, true);

    return todosService.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos(currentTodos => currentTodos
          .map(currentTodo => (currentTodo.id === todo.id
            ? { ...todo } : currentTodo)));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw error;
      })
      .finally(() => {
        taskLoader(setTodos, updatedTodo.id, false);
      });
  };

  const toggleAll = (toggle: boolean) => {
    setErrorMessage('');

    const todosToToggle = todos.filter(todo => todo.completed !== toggle);

    todosToToggle.forEach(todo => taskLoader(setTodos, todo.id, true));

    const updatePromises = todosToToggle.map(todo => todosService.updateTodo({
      ...todo,
      completed: toggle,
    }));

    Promise.all(updatePromises)
      .then(updatedTodos => {
        setTodos(currentTodos => currentTodos.map(currentTodo => {
          const updatedTodo = updatedTodos
            .find(todo => todo.id === currentTodo.id);

          return updatedTodo
            ? { ...currentTodo, completed: toggle }
            : currentTodo;
        }));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw error;
      })
      .finally(() => {
        todosToToggle.forEach(todo => taskLoader(setTodos, todo.id, false));
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsListLoading(true);

    taskLoader(setTodos, todoId, true);

    return todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() => {
        taskLoader(setTodos, todoId, false);
        setIsListLoading(false);
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
          setTodos(currentTodos => currentTodos
            .filter(currentTodo => currentTodo.id !== todo.id));
        })
        .finally(() => {
          taskLoader(setTodos, todo.id, false);
        }));

    Promise.all(deletePromises)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() => {
        setIsListLoading(false);
      });
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
                isAllCompleted={isAllCompleted}
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
                  unComletedTodos={unCompletedTodos}
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
