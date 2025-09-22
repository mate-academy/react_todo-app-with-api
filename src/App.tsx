/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
} from './api/todos';
import {
  ErrorNotification,
  Footer,
  Header,
  TodoList,
  TodoItem,
} from './components';
import { FilterType, Todo } from './types/Todo';
import { ERROR_MESSAGE } from './constants/errorMessages';

const filterTasks = (tasks: Todo[], filter: FilterType): Todo[] => {
  return tasks.filter(task => {
    const matchesState =
      filter === FilterType.ALL ||
      (filter === FilterType.ACTIVE && !task.completed) ||
      (filter === FilterType.COMPLETED && task.completed);

    return matchesState;
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [state, setState] = useState(FilterType.ALL);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [updatingTodos, setUpdatingTodos] = useState<Set<number>>(new Set());

  const handleError = useCallback((ErrorMessage: string) => {
    setErrorMessage(ErrorMessage);
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const handleStageChange = useCallback(
    (newState: FilterType) => {
      setState(newState);
    },
    [setState],
  );

  const getTasks = useCallback(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => handleError(ERROR_MESSAGE.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, [handleError]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const filteredTasks = useMemo(
    () => filterTasks(todos, state),
    [todos, state],
  );
  const activeTasks = useMemo(
    () => todos.filter(task => !task.completed).length,
    [todos],
  );
  const completedTasks = useMemo(
    () => todos.length - activeTasks,
    [todos, activeTasks],
  );

  const handleAddTodo = (title: string) => {
    const newTempTodo = {
      userId: USER_ID,
      id: 0,
      title,
      completed: false,
      isTemp: true,
    };

    setTempTodo(newTempTodo);

    return addTodo(title)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);

        return newTodo;
      })
      .catch(() => {
        setTempTodo(null);
        handleError(ERROR_MESSAGE.ADD_TODO);
        throw new Error(ERROR_MESSAGE.ADD_TODO);
      });
  };

  const handleDelete = (id: number): Promise<void> => {
    return deleteTodo(id)
      .then(() => {
        // Successfully deleted
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(e => {
        handleError(ERROR_MESSAGE.DELETE_TODO);
        throw e;
      });
  };

  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let hasErrors = false;

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
      } catch (error) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      handleError(ERROR_MESSAGE.DELETE_TODO);
    }
  };

  const handleOnToggle = async (id: number, completed: boolean) => {
    setUpdatingTodos(prev => new Set(prev.add(id)));

    try {
      await toggleTodo(id, completed);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
      );
    } catch {
      handleError(ERROR_MESSAGE.UPDATE_TODO);
    } finally {
      setUpdatingTodos(prev => {
        const newSet = new Set(prev);

        newSet.delete(id);

        return newSet;
      });
    }
  };

  const handleUpdate = async (id: number, title: string): Promise<void> => {
    setUpdatingTodos(prev => new Set(prev.add(id)));

    try {
      await editTodo(id, title);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? { ...todo, title } : todo)),
      );
    } catch (error) {
      handleError(ERROR_MESSAGE.UPDATE_TODO);
      throw error;
    } finally {
      setUpdatingTodos(prev => {
        const newSet = new Set(prev);

        newSet.delete(id);

        return newSet;
      });
    }
  };

  const handleAllToggle = async () => {
    const shouldComplete = activeTasks > 0;
    const todosToToggle = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setUpdatingTodos(prev => {
      const newSet = new Set(prev);

      todosToToggle.forEach(todo => newSet.add(todo.id));

      return newSet;
    });

    try {
      const togglePromises = todosToToggle.map(todo =>
        toggleTodo(todo.id, shouldComplete),
      );

      await Promise.all(togglePromises);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todosToToggle.some(t => t.id === todo.id)
            ? { ...todo, completed: shouldComplete }
            : todo,
        ),
      );
    } catch (error) {
      handleError(ERROR_MESSAGE.UPDATE_TODO);
    } finally {
      setUpdatingTodos(prev => {
        const newSet = new Set(prev);

        todosToToggle.forEach(todo => newSet.delete(todo.id));

        return newSet;
      });
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
          onError={handleError}
          onAddTodo={handleAddTodo}
          todos={todos}
          onAllToggle={handleAllToggle}
          isLoadingTodos={isLoading}
        />

        <TodoList
          tasks={filteredTasks}
          onDelete={handleDelete}
          onToggle={handleOnToggle}
          onUpdate={handleUpdate}
          updatingTodos={updatingTodos}
        />
        {tempTodo && (
          <div className="todoapp__main" data-cy="TempTodo">
            <TodoItem todo={tempTodo} onToggle={handleOnToggle} />
          </div>
        )}
        {!isLoading && !!todos.length && (
          <Footer
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            onStageChange={handleStageChange}
            onDeleteCompleted={handleDeleteCompleted}
            state={state}
          />
        )}
      </div>
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
