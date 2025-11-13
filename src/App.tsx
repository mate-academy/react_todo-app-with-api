/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  todosService,
  TodosServiceErrors,
  todosServiceErrorText,
  USER_ID,
} from './api/todos';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem';
import { Status } from './types/TodoStatusFilter';
import { Todo } from './types/Todo';
import { useError } from './hooks/useError';
import { TodoCreate } from './types/TodoCreate';
import { TodoList } from './components/TodoList';
import { getFilteredTodos } from './utils/todoUtils';
import { Header } from './components/TodoHeader';
import { Footer } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [selectedStatus, setSelectedStatus] = useState(Status.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const { error, handleRemoveError, handleSetError } = useError();

  const todoTitleInputRef = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed);

  const handleAddTodoToLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading => [...currentLoading, todoId]);
  };

  const handleRemoveTodoFromLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading =>
      currentLoading.filter(id => id !== todoId),
    );
  };

  const handleToggleStatus = async (todoId: Todo['id']) => {
    const todoToToggle = todos.find(todo => todo.id === todoId);

    if (!todoToToggle) {
      return;
    }

    handleAddTodoToLoading(todoId);

    try {
      await todosService.updateTodoStatus(todoId, {
        completed: !todoToToggle.completed,
      });
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch {
      handleSetError(
        todosServiceErrorText[TodosServiceErrors.UNABLE_TO_UPDATE_A_TODO],
      );
    } finally {
      handleRemoveTodoFromLoading(todoId);
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    handleAddTodoToLoading(todoId);
    handleRemoveError();

    try {
      await todosService.deleTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      handleSetError(
        todosServiceErrorText[TodosServiceErrors.UNABLE_TO_DELETE_A_TODO],
      );
    } finally {
      handleRemoveTodoFromLoading(todoId);
      if (todoTitleInputRef.current) {
        todoTitleInputRef.current.focus();
      }
    }
  };

  const handleBulkDeleteTodos = (todoIds: Todo['id'][]) => {
    todoIds.forEach(todoId => handleDeleteTodo(todoId));
  };

  const handleDeleteCompleted = () => {
    handleBulkDeleteTodos(completedTodos.map(({ id }) => id));
  };

  const handleAddTodo = async (
    newTodoTitle: string,
    resetTitle: () => void,
  ) => {
    if (!todoTitleInputRef.current) {
      return;
    }

    handleRemoveError();

    const todoCreate: TodoCreate = {
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...todoCreate,
    });

    todoTitleInputRef.current.disabled = true;

    try {
      const createdTodo = await todosService.addTodo(todoCreate);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      resetTitle();
    } catch (err) {
      handleSetError(
        todosServiceErrorText[TodosServiceErrors.UNABLE_TO_ADD_A_TODO],
      );
    } finally {
      setTempTodo(null);
      if (!todoTitleInputRef.current) {
        return;
      }

      todoTitleInputRef.current.disabled = false;
      todoTitleInputRef.current?.focus();
    }
  };

  const allTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const newStatus = !allTodosCompleted;

    handleRemoveError();

    const todosToToggle = todos.filter(todo => todo.completed !== newStatus);

    if (todosToToggle.length === 0) {
      return;
    }

    const updateOperations = todosToToggle.map(async todo => {
      handleAddTodoToLoading(todo.id);

      try {
        await todosService.updateTodoStatus(todo.id, { completed: newStatus });

        setTodos(currentTodos =>
          currentTodos.map(t =>
            t.id === todo.id ? { ...t, completed: newStatus } : t,
          ),
        );
      } catch {
        handleSetError(
          todosServiceErrorText[TodosServiceErrors.UNABLE_TO_UPDATE_A_TODO],
        );
      } finally {
        handleRemoveTodoFromLoading(todo.id);
      }
    });

    await Promise.all(updateOperations);
  };

  const handleSaveTitle = async (todoId: Todo['id'], newTitle: string) => {
    handleAddTodoToLoading(todoId);
    handleRemoveError();

    try {
      await todosService.updateTodoTitle(todoId, newTitle);
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: newTitle } : todo,
        ),
      );
    } catch (err) {
      handleSetError(
        todosServiceErrorText[TodosServiceErrors.UNABLE_TO_UPDATE_A_TODO],
      );
      throw err;
    } finally {
      handleRemoveTodoFromLoading(todoId);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await todosService.getTodos();

        setTodos(todosFromServer);
      } catch (err) {
        handleSetError(
          todosServiceErrorText[TodosServiceErrors.UNABLE_TO_LOAD_TODOS],
        );
      }
    };

    loadTodos();
  }, [handleSetError]);

  const filteredTodos = getFilteredTodos(todos, selectedStatus);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToggleAll={handleToggleAll}
          allTodosCompleted={allTodosCompleted}
          onAddTodo={handleAddTodo}
          onError={handleSetError}
          todoTitleInputRef={todoTitleInputRef}
          hasTodos={todos.length > 0}
        />

        {filteredTodos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            isLoading={(todoId: Todo['id']) => loadingTodoIds.includes(todoId)}
            onDelete={handleDeleteTodo}
            onToggleStatus={handleToggleStatus}
            onSaveTitle={handleSaveTitle}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isLoading />}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleRemoveError}
        />
        {error}
      </div>
    </div>
  );
};
