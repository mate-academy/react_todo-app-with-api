/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const todosCounter = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const todosCompletedIds = () => {
    const idsCompleted = todos.filter(t => t.completed).map(t => t.id);

    return idsCompleted;
  };

  const setAllTodosCompleted = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (todos.length === todosCompletedIds().length) {
      const completedTodos = todos.filter(todo => todo.completed);
      const ids = completedTodos.map(todo => todo.id);

      setProcessings(prev => [...prev, ...ids]);

      Promise.allSettled(
        completedTodos.map(todo =>
          todoService.updateTodo({ ...todo, completed: false }),
        ),
      )
        .then(results => {
          const successIds = completedTodos
            .filter((_, index) => results[index].status === 'fulfilled')
            .map(todo => todo.id);

          const failed = results.some(result => result.status === 'rejected');

          if (successIds.length > 0) {
            setTodos(current =>
              current.map(todo =>
                successIds.includes(todo.id)
                  ? { ...todo, completed: false }
                  : todo,
              ),
            );
          }

          if (failed) {
            showError('Unable to update a todo');
          }
        })
        .finally(() =>
          setProcessings(prev => prev.filter(id => !ids.includes(id))),
        );
    }

    const ids = activeTodos.map(todo => todo.id);

    setProcessings(prev => [...prev, ...ids]);

    Promise.allSettled(
      activeTodos.map(todo =>
        todoService.updateTodo({ ...todo, completed: true }),
      ),
    )
      .then(results => {
        const successIds = activeTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        const failed = results.some(result => result.status === 'rejected');

        if (successIds.length > 0) {
          setTodos(current =>
            current.map(todo =>
              successIds.includes(todo.id)
                ? { ...todo, completed: true }
                : todo,
            ),
          );
        }

        if (failed) {
          showError('Unable to update a todo');
        }
      })
      .finally(() =>
        setProcessings(prev => prev.filter(id => !ids.includes(id))),
      );
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const ids = completedTodos.map(todo => todo.id);

    setProcessings(prev => [...prev, ...ids]);

    Promise.allSettled(ids.map(id => todoService.deleteTodo(id)))
      .then(results => {
        const successIds = ids.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        const failed = results.some(result => result.status === 'rejected');

        if (successIds.length > 0) {
          setTodos(current =>
            current.filter(todo => !successIds.includes(todo.id)),
          );
        }

        if (failed) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => !ids.includes(id)));
      });
  };

  const setFilter = (method: Filter) => {
    setSelectedFilter(method);
  };

  const visibleTodos = useCallback(
    (method: Filter) => {
      let filteredTodos = todos;

      if (method !== 'all') {
        filteredTodos = filteredTodos.filter(todo =>
          method === 'completed' ? todo.completed : !todo.completed,
        );
      }

      return filteredTodos;
    },
    [todos],
  );

  const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setTempTodo({ id: 0, title, completed: false, userId });

    return todoService
      .addTodo({ title, completed, userId })
      .then((newTodo: Todo) => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setTempTodo(null);
        showError('Unable to add a todo');
        throw error;
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setProcessings(prev => [...prev, updatedTodo.id]);

    return todoService
      .updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(error => {
        showError('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessings(prev => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setAllTodosCompleted={() => setAllTodosCompleted()}
          todosCompletedIds={() => todosCompletedIds().length}
          todos={todos}
          onSubmit={title =>
            addTodo({ title, completed: false, userId: todoService.USER_ID })
          }
          onError={(msg: string) => showError(msg)}
          processings={processings}
        />

        <TodoList
          onUpdate={(updatedTodo: Todo) => updateTodo(updatedTodo)}
          processings={processings}
          todos={visibleTodos(selectedFilter)}
          tempTodo={tempTodo}
          onDelete={todoId => deleteTodo(todoId)}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todosCompletedCounter={todosCompletedIds().length}
            clearCompleted={clearCompleted}
            todosCounter={todosCounter}
            onSelect={method => setFilter(method)}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
