/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoError,
  TodosErrors,
  updateTodo,
  USER_ID,
} from './api/todos';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { useProcessingTodos } from './hooks/useProcessingTodo';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterOptions } from './components/StatusFilter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [statusFiltration, setStatusFiltration] = useState(FilterOptions.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processingTodosId, add, remove } = useProcessingTodos();

  const handleHideErrors = useCallback(() => setErrorMessage(null), []);
  const showTheFooter = todos.length > 0;
  const filteredTodos = getFilteredTodos(todos, { status: statusFiltration });
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodoCount = todos.length - completedTodos.length;
  const handleAddTodoProcessing = add;
  const handleRemoveTodoFromProcessing = remove;

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodosErrors.UnableToLoad);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteTodo = useCallback(
    (todoId: Todo['id']) => {
      handleAddTodoProcessing(todoId);

      deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodo =>
            currentTodo.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => {
          setErrorMessage(TodosErrors.UnableToDeleteTodo);
          throw new Error(TodosErrors.UnableToDeleteTodo);
        })
        .finally(() => {
          handleRemoveTodoFromProcessing(todoId);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    },
    [handleAddTodoProcessing, handleRemoveTodoFromProcessing],
  );

  const handleAddTodo = useCallback((title: Todo['title']) => {
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const temp: Todo = { ...newTodo, id: 0 };

    setTempTodo(temp);

    return createTodo(newTodo)
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
      })
      .catch(() => {
        setErrorMessage(TodosErrors.UnableToAddTodo);

        throw new Error(TodosErrors.UnableToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  const handleUpdateTodo = useCallback(
    (todoId: Todo['id'], modifiedTodo: Omit<Todo, 'id'>): Promise<void> => {
      handleAddTodoProcessing(todoId);

      return updateTodo(todoId, modifiedTodo)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(TodosErrors.UnableToUpdateTodo);

          throw new Error(TodosErrors.UnableToUpdateTodo);
        })
        .finally(() => {
          handleRemoveTodoFromProcessing(todoId);
        });
    },
    [handleAddTodoProcessing, handleRemoveTodoFromProcessing],
  );

  const handleAllTodoStatus = useCallback(() => {
    const shouldBeComleted = completedTodos.length !== todos.length;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeComleted,
    );

    todosToUpdate.forEach(todo => {
      handleUpdateTodo(todo.id, {
        title: todo.title,
        completed: shouldBeComleted,
        userId: todo.userId,
      });
    });
  }, [todos, completedTodos, handleUpdateTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          onError={setErrorMessage}
          inputRef={inputRef}
          toggleAll={handleAllTodoStatus}
          hasTodos={todos.length > 0}
          allCompleted={todos.length === completedTodos.length}
        />

        {!isLoading && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodoStatus={handleUpdateTodo}
              isLoadingTodoIds={processingTodosId}
            />

            {showTheFooter && (
              <Footer
                itemsLeft={activeTodoCount}
                statusFiltration={statusFiltration}
                onStatusChange={setStatusFiltration}
                completedCount={completedTodos.length}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideErrors={handleHideErrors}
      />
    </div>
  );
};
