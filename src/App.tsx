// #region Import
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as todoService from './api/todos';

import { Todo } from './types/Todo';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { FILTER, FilterType } from './constants/Filter';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
// #endregion

export const App: React.FC = () => {
  // #region useState
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FILTER.all);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region useEffect
  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);
  // #endregion

  // #region handle
  const handleAddTodo = useCallback((title: string): Promise<void> => {
    const temporaryTodo: Todo = {
      id: 0,
      title,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsAdding(true);

    return todoService
      .createTodo(temporaryTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error('Unable to add todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  }, []);

  const handleEmptyTitle = useCallback(() => {
    setErrorMessage('Title should not be empty');
  }, []);

  const handleDeleteTodo = useCallback((todoId: number): Promise<void> => {
    setProcessingTodos(currentIds => [...currentIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error('Unable to delete todo');
      })
      .finally(() => {
        setProcessingTodos(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        newTodoInputRef.current?.focus();
      });
  }, []);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setProcessingTodos(currentIds => [
      ...currentIds,
      ...completedTodosIds.filter(id => !currentIds.includes(id)),
    ]);

    const results = await Promise.all(
      completedTodos.map(todo =>
        todoService
          .deleteTodo(todo.id)
          .then(() => ({ id: todo.id, success: true }))
          .catch(() => ({ id: todo.id, success: false })),
      ),
    );

    const deletedTodoIds = results
      .filter(result => result.success)
      .map(result => result.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
    );

    if (results.some(result => !result.success)) {
      setErrorMessage('Unable to delete a todo');
    }

    setProcessingTodos(currentIds =>
      currentIds.filter(id => !completedTodosIds.includes(id)),
    );
    newTodoInputRef.current?.focus();
  };

  const handleToggleTodo = useCallback(
    (todoId: number) => {
      const todo = todos.find(currentTodo => currentTodo.id === todoId);

      if (!todo) {
        return;
      }

      setProcessingTodos(currentIds => [...currentIds, todoId]);

      todoService
        .updateTodo({
          ...todo,
          completed: !todo.completed,
        })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === todoId ? updatedTodo : currentTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setProcessingTodos(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
        });
    },
    [todos],
  );

  const handleToggleAll = useCallback(() => {
    const shouldComplete = todos.some(todo => !todo.completed);

    todos
      .filter(todo => todo.completed !== shouldComplete)
      .forEach(todo => {
        handleToggleTodo(todo.id);
      });
  }, [todos, handleToggleTodo]);

  const handleRenameTodo = useCallback(
    (todoId: number, title: string): Promise<void> => {
      const todo = todos.find(currentTodo => currentTodo.id === todoId);

      if (!todo) {
        return Promise.resolve();
      }

      setProcessingTodos(currentIds => [...currentIds, todoId]);

      return todoService
        .updateTodo({
          ...todo,
          title,
        })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === todoId ? updatedTodo : currentTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          throw new Error('Unable to rename todo');
        })
        .finally(() => {
          setProcessingTodos(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
        });
    },
    [todos],
  );
  // #endregion

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === FILTER.active) {
        return !todo.completed;
      }

      if (filter === FILTER.completed) {
        return todo.completed;
      }

      return true;
    });
  }, [filter, todos]);

  const activeTodosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const areAllCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  }, [todos]);

  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          areAllCompleted={areAllCompleted}
          onToggleAll={handleToggleAll}
          onAdd={handleAddTodo}
          onEmpty={handleEmptyTitle}
          isAdding={isAdding}
          inputRef={newTodoInputRef}
        />

        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
            processingTodos={processingTodos}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isProcessed />}

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <TodoFooter
            activeTodosCounter={activeTodosCounter}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={todos.some(todo => todo.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};
