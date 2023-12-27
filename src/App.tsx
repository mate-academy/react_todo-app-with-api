import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodoStatus,
  patchTodoTitle,
} from './api/todos';
import { TodoList } from './TodoList/TodoList';
import {
  applyUncompleted,
  applyHasCompleted,
  applySelectedTodos,
  removeTodo,
} from './helpers/helpers';
import { Filter } from './types/Selected-filter-enum';
import { ErrorType } from './types/errors-enum';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Notification } from './Notification/Notification';

const USER_ID = 12057;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo []>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterType, setFilterType] = useState<Filter>(Filter.all);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [hasDeleted, setDeleted] = useState(false);

  const hasTodosFromServer = todos.length !== 0;

  const handleFilterType = (type: Filter) => {
    setFilterType(type);
  };

  const handleTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleError = (errorMessage: ErrorType) => {
    setError(errorMessage);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const refreshTodos = () => {
    setError(null);
    getTodos(USER_ID)
      .then((todosFS => setTodos(todosFS)))
      .catch(() => handleError(ErrorType.DidNotGetTodos));
  };

  useEffect(refreshTodos, []);

  const onCreateTodo = () => {
    const trimmedTitle = newTitle.trim();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then((todoFromServer) => {
        setNewTitle('');
        setTodos((currentTodos) => [...currentTodos, todoFromServer]);
      })
      .catch(() => {
        handleError(ErrorType.CantUploadTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const onStatusChange = (todoId: number) => {
    const todoForPatch = todos.find(({ id }) => id === todoId) || null;

    setLoadingTodosIds(prev => [...prev, todoId]);

    if (todoForPatch) {
      patchTodoStatus(todoId, !todoForPatch.completed, USER_ID)
        .then(refreshTodos)
        .catch(() => {
          handleError(ErrorType.CantUpdateTodo);
        })
        .finally(() => {
          setLoadingTodosIds(prev => prev.filter(currId => currId !== todoId));
        });
    }
  };

  const onTitleChange = (todoId: number, title: string) => {
    setLoadingTodosIds(prev => [...prev, todoId]);

    patchTodoTitle(todoId, title, USER_ID)
      .then(refreshTodos)
      .catch(() => {
        handleError(ErrorType.CantUpdateTodo);
      })
      .finally(() => {
        setLoadingTodosIds(prev => prev.filter(currId => currId !== todoId));
      });
  };

  const onDeleteTodo = (id: number) => {
    setLoadingTodosIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos((currentTodos) => removeTodo(id, currentTodos));
      })
      .catch(() => {
        handleError(ErrorType.CantDeleteTodo);
      })
      .finally(() => {
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(({ id }) => {
      onDeleteTodo(id);
    });

    setDeleted(true);
  };

  const todosForMap = applySelectedTodos(filterType, todos);
  const uncompletedCount = applyUncompleted(todos);
  const hasCompleted = applyHasCompleted(todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTitle={handleTitle}
          title={newTitle}
          onCreateTodo={onCreateTodo}
          onError={handleError}
          isLoading={isLoading}
          onStatusChange={onStatusChange}
          todosForMap={todosForMap}
          hasDeleted={hasDeleted}
          hasTodosFromServer={hasTodosFromServer}
        />

        {hasTodosFromServer
          && (
            <>
              <TodoList
                todos={todosForMap}
                tempTodo={tempTodo}
                onDeleteTodo={onDeleteTodo}
                onStatusChange={onStatusChange}
                loadingTodosIds={loadingTodosIds}
                onTitleChange={onTitleChange}
                setDeleted={setDeleted}
              />

              <Footer
                filterType={filterType}
                onHandleFilterType={handleFilterType}
                uncompletedCount={uncompletedCount}
                onClearCompleted={clearCompleted}
                hasCompleted={hasCompleted}
              />
            </>
          )}
      </div>

      <Notification
        error={error}
        onCloseError={setError}
      />
    </div>
  );
};
