import React, { useEffect, useMemo, useState } from 'react';
import { Header, Footer, Notification, TodoList } from './components';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { FilterOption, Todo, Error } from './types';
import { useError } from './hooks';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.all,
  );
  const [todoInputValue, setTodoInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [focusHeader, setFocusHeader] = useState(true);
  const { error, handleError, handleResetError } = useError();

  const todosAmount = useMemo(() => todos.length, [todos]);
  const uncompletedTodosAmount = useMemo(
    () => todos.reduce((amount, todo) => amount + (todo.completed ? 0 : 1), 0),
    [todos],
  );

  const handleGetTodos = () => {
    getTodos()
      .then(currentTodos => {
        setTodos(currentTodos);
      })
      .catch(() => {
        handleError(Error.LOADING_TODOS);
      });
  };

  const handleSubmitTodo = (title: string) => {
    if (!title) {
      handleError(Error.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    setIsLoading(true);
    setFocusHeader(false);

    addTodo(newTodo)
      .then(response => {
        setTodos(currentTodos => [...currentTodos, response]);
        setTodoInputValue('');
      })
      .catch(() => {
        handleError(Error.ADDING_TODO);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setFocusHeader(true);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodoIds(current => [...current, id]);
    setFocusHeader(false);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));

        if (editingTodoId) {
          setEditingTodoId(null);
        }
      })
      .catch(() => handleError(Error.DELETING_TODO))
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(deletedId => deletedId !== id),
        );
        setIsLoading(false);
        if (!editingTodoId) {
          setFocusHeader(true);
        }
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(handleDeleteTodo);
  };

  const handleUpdateTodo = (id: number, data: Partial<Todo>) => {
    setIsLoading(true);
    setLoadingTodoIds(currentIds => [...currentIds, id]);

    updateTodo({ id, ...data })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );

        setEditingTodoId(null);
      })
      .catch(() => handleError(Error.UPDATING_TODO))
      .finally(() => {
        setLoadingTodoIds(ids =>
          ids.filter(loadingTodoId => loadingTodoId !== id),
        );
        setIsLoading(false);
      });
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    handleUpdateTodo(id, { completed: !currentStatus });
  };

  const handleToggleAll = () => {
    const isAllStatusSame =
      todosAmount === uncompletedTodosAmount || !uncompletedTodosAmount;

    todos.forEach(({ id, completed }) => {
      const newStatus = isAllStatusSame ? !completed : true;

      if (completed !== newStatus) {
        handleUpdateTodo(id, { completed: newStatus });
      }
    });
  };

  const handleUpdateTitle = (todo: Todo, title: string) => {
    if (!title.length) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (todo.title === title) {
      setEditingTodoId(null);

      return;
    }

    handleUpdateTodo(todo.id, { title: title });
  };

  useEffect(() => {
    handleGetTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosAmount={todosAmount}
          uncompletedTodosAmount={uncompletedTodosAmount}
          isLoading={isLoading}
          title={todoInputValue}
          onTitleChange={setTodoInputValue}
          onSubmit={handleSubmitTodo}
          onToggleAll={handleToggleAll}
          focusHeader={focusHeader}
        />

        <TodoList
          todos={todos}
          filterOption={filterOption}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          isNewTodoLoading={isLoading}
          editingTodoId={editingTodoId}
          onStartEditing={setEditingTodoId}
          onToggleStatus={handleToggleStatus}
          onUpdateTitle={handleUpdateTitle}
          setEditingTodoId={setEditingTodoId}
        />

        {!!todosAmount && (
          <Footer
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            todosAmount={todosAmount}
            uncompletedTodosAmount={uncompletedTodosAmount}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <Notification error={error} onReset={handleResetError} />
    </div>
  );
};
