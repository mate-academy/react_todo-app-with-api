/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import * as apiService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotifications } from './components/ErrorNotifications';
import { TypeFilter } from './types/TypeFilter';
import { getFilteredTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [newTodoInput, setNewTodoInput] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(TypeFilter.All);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);
  const newInputRef = useRef<HTMLInputElement>(null);

  const notCompletedTasks = todos.filter(todo => !todo.completed);
  const notCompletedTasksCounter = notCompletedTasks.length;
  const completedTasks = todos.filter(todo => todo.completed);
  const filteredTodos = getFilteredTodos(todos, filterBy);

  const loadTodos = () => {
    setErrorMessage('');
    apiService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .then(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  useEffect(() => {
    newInputRef.current?.focus();
  }, [hasTitleFocus]);

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTodoInput.trim();

    if (title) {
      setIsLoading(true);
      setHasTitleFocus(true);

      const userId = apiService.USER_ID;
      const completed = false;

      setTempTodo({ id: 0, title, userId, completed });

      apiService
        .createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoInput('');
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
          setHasTitleFocus(false);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const handleDeleteTodo = (todoIds: number[]) => {
    if (todoIds.length === 0) {
      return;
    }

    setHasTitleFocus(true);

    setLoadingIds(todoIds);

    todoIds.map(todoId => {
      apiService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setLoadingIds([]);
          setHasTitleFocus(false);
        });
    });
  };

  const handleSwitchTodo = (updatedTodos: Todo[]) => {
    setLoadingIds(updatedTodos.map(todo => todo.id));

    updatedTodos.map(todo => {
      const updatedTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: !todo.completed,
      };

      apiService
        .updateTodo(updatedTodo)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
            );
          });
        })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setLoadingIds([]);
        });
    });
  };

  const handleSwitchTodos = (handleType: string) => {
    if (handleType === 'makeAllCompleted') {
      setLoadingIds(notCompletedTasks.map(todo => todo.id));

      notCompletedTasks.map(todo => {
        const updatedTodo = {
          id: todo.id,
          userId: todo.id,
          title: todo.title,
          completed: true,
        };

        apiService
          .updateTodo(updatedTodo)
          .then(() => {
            setTodos(currentTodos => {
              return currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              );
            });
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoadingIds([]);
          });
      });
    } else if (handleType === 'makeAllActive') {
      setLoadingIds(completedTasks.map(todo => todo.id));

      completedTasks.map(todo => {
        const updatedTodo = {
          id: todo.id,
          userId: todo.id,
          title: todo.title,
          completed: false,
        };

        apiService
          .updateTodo(updatedTodo)
          .then(() => {
            setTodos(currentTodos => {
              return currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              );
            });
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoadingIds([]);
          });
      });
    }
  };

  const clearCompletedTasks = () => {
    const todoCompletedIds = completedTasks.map(todo => todo.id);

    handleDeleteTodo(todoCompletedIds);
  };

  const updateTitleName = (todosDataUpdate: Todo[]) => {
    const todoIds = todosDataUpdate.map(todo => todo.id);

    setLoadingIds(todoIds);

    return todosDataUpdate.map(todoDataUpdate => {
      return apiService
        .updateTodo(todoDataUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === todoDataUpdate.id ? updatedTodo : todo,
            ),
          );

          return true;
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');

          return false;
        })
        .finally(() => {
          setLoadingIds([]);
        });
    });
  };

  return (
    <div className="tod``oapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTodoInput={newTodoInput}
          setNewTodoInput={setNewTodoInput}
          addTodo={addTodo}
          isLoading={isLoading}
          handleSwitchTodos={handleSwitchTodos}
          newInputRef={newInputRef}
        />
        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingIds={loadingIds}
          handleSwitchTodo={handleSwitchTodo}
          updateTitleName={updateTitleName}
        />

        {todos.length > 0 && (
          <TodoFooter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            notCompletedTasksCounter={notCompletedTasksCounter}
            isCompletedExists={completedTasks.length !== 0}
            clearCompletedTasks={clearCompletedTasks}
          />
        )}
      </div>
      <ErrorNotifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
