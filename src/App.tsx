/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { ErrorMessage, FilterStatus, Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const [todoStatus, setTodoStatus] = useState(FilterStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [updateTodoId, setUpdateTodoId] = useState<number | null>(null);

  const { addTodo, getTodos, deleteTodo, updateTodo } = todoService;

  const handleError = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
    const timeoutId = setTimeout(() => {
      setErrorMessage(ErrorMessage.DEFAULT);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorMessage.LOAD))
      .finally(() => setIsLoading(false));
  }, [handleError, getTodos]);

  const visibleTodos = todos.filter(todo => {
    switch (todoStatus) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      case FilterStatus.ALL:
      default:
        return true;
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddTodo = useCallback(
    ({ id, title, completed, userId }: Todo) => {
      if (!inputValue.trim()) {
        handleError(ErrorMessage.TITLE);

        return;
      }

      setTempTodo({ id, title, completed, userId });
      if (inputRef.current) {
        inputRef.current.disabled = true;
      }

      addTodo({ title, completed, userId })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTempTodo(null);
          setInputValue('');
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        })
        .catch(() => {
          handleError(ErrorMessage.ADD);
          setTempTodo(null);
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        });
    },
    [handleError, inputValue, addTodo],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      setLoadingTodoIds(prev => [...prev, todoId]);
      deleteTodo(todoId)
        .then(() => {
          const filteredTodos = todos.filter(todo => todo.id !== todoId);

          setTodos(filteredTodos);
          inputRef.current?.focus();
        })
        .catch(() => {
          handleError(ErrorMessage.DELETE);
          inputRef.current?.focus();
        })
        .finally(() =>
          setLoadingTodoIds(prev => prev.filter(id => id !== todoId)),
        );
    },
    [handleError, todos, deleteTodo],
  );

  const handleDeleteCompletedTodo = useCallback(() => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (!completedTodo.length) {
      return;
    }

    const idsDelete = completedTodo.map(todo => todo.id);

    setLoadingTodoIds(idsDelete);

    completedTodo.forEach(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(item => item.id !== todo.id),
          );
          inputRef.current?.focus();
        })
        .catch(() => {
          handleError(ErrorMessage.DELETE);
          inputRef.current?.focus();
        })
        .finally(() => {
          setLoadingTodoIds([]);
        }),
    );
  }, [handleError, todos, deleteTodo]);

  const handleUpdateTodo = useCallback(
    (updatedTodo: Todo) => {
      setLoadingTodoIds(prev => [...prev, updatedTodo.id]);
      updateTodo(updatedTodo)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.map(item =>
              item.id === updatedTodo.id ? updatedTodo : item,
            );
          });
          setUpdateTodoId(null);
        })
        .catch(() => {
          setLoadingTodoIds(loadingTodoIds.filter(id => id !== updatedTodo.id));
          handleError(ErrorMessage.UPDATE);
        })
        .finally(() => {
          setLoadingTodoIds(ids => ids.filter(id => id !== updatedTodo.id));
        });
    },
    [handleError, loadingTodoIds, updateTodo],
  );

  const handleChangeTodos = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== !areAllCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoIds(todosToUpdate.map(todo => todo.id));

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: !areAllCompleted }),
      ),
    )
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updated = updatedTodos.find(item => item.id === todo.id);

            return updated || todo;
          }),
        );
      })
      .catch(() => handleError(ErrorMessage.UPDATE))
      .finally(() => setLoadingTodoIds([]));
  }, [todos, handleError, updateTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleChangeTodos={handleChangeTodos}
          handleAddTodo={handleAddTodo}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
        />

        {!isLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                visibleTodos={visibleTodos}
                handleDeleteTodo={handleDeleteTodo}
                loadingTodoIds={loadingTodoIds}
                handleUpdateTodo={handleUpdateTodo}
                updateTodoId={updateTodoId}
                setUpdateTodoId={setUpdateTodoId}
                tempTodo={tempTodo}
                inputRef={inputRef}
              />
            </section>
            {todos.length > 0 && (
              <Footer
                todos={todos}
                todoStatus={todoStatus}
                setTodoStatus={setTodoStatus}
                handleDeleteCompletedTodo={handleDeleteCompletedTodo}
              />
            )}
          </>
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
