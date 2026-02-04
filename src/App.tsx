/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { createTodos, getTodos, patchTodo } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { deleteTodo } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { Notification } from './components/Notification/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const headerRef = useRef<HTMLInputElement>(null);

  const handleShowError = (error: string) => {
    setErrorMessage(error);
  };

  const handleToggleTodos = (status: boolean) => {
    const allUpdateTodos = todos.filter(todo => todo.completed === !status);

    const neededUpdateIds = allUpdateTodos.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...neededUpdateIds]);

    const promises = allUpdateTodos.map(todo =>
      patchTodo(todo.id, { ...todo, completed: status }),
    );

    Promise.all(promises)
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updated = updatedTodos.find(u => u.id === todo.id);

            return updated ? updated : todo;
          }),
        );
      })
      .catch(() => {
        handleShowError(ErrorMessage.UpdateMessage);
      })
      .finally(() => {
        setProcessingIds(prev =>
          prev.filter(id => !neededUpdateIds.includes(id)),
        );
      });
  };

  const handleDeleteCompleteAll = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedIds]);

    const promises = completedIds.map(id =>
      deleteTodo(id).then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      }),
    );

    Promise.all(promises)
      .catch(() => {
        handleShowError(ErrorMessage.DeleteMessage);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !completedIds.includes(id)));
        headerRef.current?.focus();
      });
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
        headerRef.current?.focus();
      })
      .catch(() => {
        handleShowError(ErrorMessage.DeleteMessage);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleUpdateTodo = (id: number, data: Todo) => {
    setProcessingIds(prev => [...prev, id]);

    return patchTodo(id, data)
      .then(updatedTodo => {
        setTodos(currentTodo =>
          currentTodo.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        handleShowError(ErrorMessage.UpdateMessage);

        return Promise.reject();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(currentId => currentId !== id));
      });
  };

  const handleCreateTodo = (title: string): Promise<void> => {
    const trimTitle = title.trim();

    if (trimTitle.length === 0) {
      handleShowError(ErrorMessage.TitleEmpty);

      return Promise.reject();
    }

    if (headerRef.current) {
      headerRef.current.disabled = true;
    }

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    setTempTodo(todo);

    return createTodos(trimTitle)
      .then(newTodo => {
        setTodos(currentTodo => {
          return [...currentTodo, newTodo];
        });
      })
      .catch(() => {
        handleShowError(ErrorMessage.AddMessage);
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
        if (headerRef.current) {
          headerRef.current.disabled = false;
          headerRef.current.focus();
        }
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadMessage);
      });
  }, []);

  const getFilteredTodos = (todosToFilter: Todo[], status: FilterStatus) => {
    return todosToFilter.filter(todo => {
      switch (status) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        case FilterStatus.All:
        default:
          return true;
      }
    });
  };

  const visibleTodos = getFilteredTodos(todos, filter);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onCreateTodo={handleCreateTodo}
          ref={headerRef}
          todosCountInfo={[todos.length, activeTodosCount]}
          onToggleTodos={handleToggleTodos}
        />
        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
            onPatch={handleUpdateTodo}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isLoading={true}
            onPatch={handleUpdateTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompleteAll={handleDeleteCompleteAll}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.DefaultValue)}
      />
    </div>
  );
};
