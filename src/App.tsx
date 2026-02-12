/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { FilterOption } from './types/FilterOption';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [filterOption, setFilterOption] = useState(FilterOption.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoRef = useRef<HTMLInputElement>(null);

  const { activeTodosCount, completedTodosCount } = useMemo(() => {
    const activeCount = todos.filter(todo => !todo.completed).length;

    return {
      activeTodosCount: activeCount,
      completedTodosCount: todos.length - activeCount,
    };
  }, [todos]);

  const isFooterVisible = useMemo(
    () => todos.length || tempTodo,
    [todos, tempTodo],
  );

  const handleCloseError = () => {
    setErrorMessage(ErrorMessage.Default);
  };

  const filteredTodos = useMemo(() => {
    switch (filterOption) {
      case FilterOption.All:
        return todos;
      case FilterOption.Active:
        return todos.filter(todo => !todo.completed);
      case FilterOption.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterOption]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const handleAddNewTodo = (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return Promise.reject();
    }

    if (newTodoRef.current) {
      newTodoRef.current.disabled = true;
    }

    setTempTodo({ title, id: 0, completed: false, userId: USER_ID });

    return postTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTempTodo(null);
        throw new Error();
      })
      .finally(() => {
        if (newTodoRef.current) {
          newTodoRef.current.disabled = false;
          newTodoRef.current.focus();
        }
      });
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(curr => curr.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
        newTodoRef.current?.focus();
      });
  };

  const handleDeleteCompletedTodos = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedIds]);
    const promises = completedIds.map(id => {
      return deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(procId => procId !== id));
        });
    });

    Promise.all(promises).then(results => {
      if (results.includes(false)) {
        setErrorMessage(ErrorMessage.Delete);
      }

      newTodoRef.current?.focus();
    });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setProcessingIds(prev => [...prev, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(responseTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? responseTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        throw new Error();
      })
      .finally(() => {
        setProcessingIds(prev =>
          prev.filter(currentId => currentId !== updatedTodo.id),
        );
      });
  };

  const handleToggleTodos = (status: boolean) => {
    const neededUpdateTodos = todos.filter(todo => todo.completed === !status);

    const neededUpdateIds = neededUpdateTodos.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...neededUpdateIds]);

    const promises = neededUpdateTodos.map(todo => {
      return updateTodo({ ...todo, completed: status })
        .then(responseTodo => {
          setTodos(currentTodos =>
            currentTodos.map(t =>
              t.id === responseTodo.id ? responseTodo : t,
            ),
          );

          return true;
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(procId => procId !== todo.id));
        });
    });

    Promise.all(promises).then(results => {
      if (results.includes(false)) {
        setErrorMessage(ErrorMessage.Update);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todosCountInfo={[todos.length, activeTodosCount]}
          onAddNewTodo={handleAddNewTodo}
          ref={newTodoRef}
          onToggleTodos={handleToggleTodos}
        />

        {Boolean(todos.length) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onTodoDelete={handleDeleteTodo}
            onTodoUpdate={handleUpdateTodo}
            processingIds={processingIds}
          />
        )}
        {isFooterVisible && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            selectedFilter={filterOption}
            onFilterChange={setFilterOption}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>
      <ErrorNotification message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
