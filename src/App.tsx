/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import './styles/todoapp.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  USER_ID,
  deleteTodo,
  getTodos,
  patchTodo,
  createTodo,
} from './api/todos';
import { todoFilter } from './utils/todoFilter';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';

import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { ProcessStatus } from './types/ProcessStatus';

export const App: React.FC = () => {
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState(FilterType.All);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idsProccesing, setIdsProccesing] = useState<number[]>([]);

  const [title, setTitle] = useState('');

  const focusField = useRef<HTMLInputElement>(null);

  const beforeRequest = () => {
    setShowError(false);
    setIsLoading(true);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);

    setTimeout(() => setShowError(false), 3000);
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleError(ErrorType.tittleEmptyError);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: newTodo.title,
      userId: newTodo.userId,
      completed: newTodo.completed,
    });

    beforeRequest();

    createTodo(newTodo)
      .then(createdTodo => {
        setCurrentTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
        setTempTodo(null);
        setIsLoading(false);

        if (focusField.current) {
          focusField.current.focus();
        }
      })
      .catch(() => {
        handleError(ErrorType.addError);
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setDeletingTodoId(id);
    beforeRequest();

    deleteTodo(id)
      .then(() => {
        setCurrentTodos(prev => prev.filter(todo => todo.id !== id));
        setDeletingTodoId(null);
        setIsLoading(false);
      })
      .catch(() => {
        handleError(ErrorType.deleteError);
        setDeletingTodoId(null);
        setIsLoading(false);
      });
  };

  const handleEdit = async (id: number, data: Partial<Todo>) => {
    try {
      const editedTodo = await patchTodo(id, data);

      setCurrentTodos(prev =>
        prev.map(todo => {
          if (todo.id === id) {
            return { ...editedTodo };
          }

          return todo;
        }),
      );
    } catch {
      handleError(ErrorType.updateError);
      throw new Error(ErrorType.updateError);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = currentTodos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setIdsProccesing(completedIds);
    try {
      const deleteCallBack = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: ProcessStatus.resolved };
        } catch {
          handleError(ErrorType.deleteError);

          return { id: todo.id, status: ProcessStatus.rejected };
        } finally {
          setIdsProccesing([]);
        }
      };

      const response = await Promise.all(completedTodos.map(deleteCallBack));

      const successfulDeletedIds = response
        .filter(respond => respond.status === ProcessStatus.resolved)
        .map(respond => respond.id);

      setCurrentTodos(prev =>
        prev.filter(todo => !successfulDeletedIds.includes(todo.id)),
      );
    } catch {
      handleError(ErrorType.clearComplitedError);
    }
  };

  const getTodosCountByStatus = (todo: Todo[]) => {
    const todosLeft = todo.filter(item => !item.completed);
    const todoCompleted = todo.filter(item => item.completed);

    return {
      activeTodos: todosLeft.length,
      todoCompleted: todoCompleted.length,
    };
  };

  const handleToggleAll = async () => {
    const { todoCompleted } = getTodosCountByStatus(currentTodos);

    if (todoCompleted === currentTodos.length) {
      try {
        setIdsProccesing(currentTodos.map(todo => todo.id));
        const updatedTodos = await Promise.all(
          currentTodos.map(todo => patchTodo(todo.id, { completed: false })),
        );

        setCurrentTodos(updatedTodos);
      } catch {
        handleError(ErrorType.updateError);
      } finally {
        setIdsProccesing([]);
      }

      return;
    }

    const todosNeedChange = currentTodos.filter(todo => !todo.completed);
    const activeTodoIds = todosNeedChange.map(todo => todo.id);

    setIdsProccesing(activeTodoIds);

    try {
      await Promise.all(
        todosNeedChange.map(todo => patchTodo(todo.id, { completed: true })),
      );

      setCurrentTodos(prev =>
        prev.map(todo =>
          todo.completed ? todo : { ...todo, completed: true },
        ),
      );
    } catch {
      handleError(ErrorType.updateError);
    } finally {
      setIdsProccesing([]);
    }
  };

  useEffect(() => {
    beforeRequest();
    getTodos()
      .then(todosFromServer => {
        setCurrentTodos(todosFromServer);
      })
      .catch(() => {
        handleError(ErrorType.loadError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [currentTodos.length, showError]);

  const filteredTodos = useMemo(
    () => todoFilter(filter, currentTodos),
    [filter, currentTodos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={currentTodos}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
          focusField={focusField}
          onToggleAll={handleToggleAll}
          getTodosStateStatistic={getTodosCountByStatus}
        />

        {currentTodos.length > 0 && (
          <>
            <TodosList
              todos={filteredTodos}
              onDelete={handleDelete}
              tempTodo={tempTodo}
              deletingTodoId={deletingTodoId}
              idsProccesing={idsProccesing}
              onEdit={handleEdit}
              errorProccesing={handleError}
            />
            <Footer
              todoCount={getTodosCountByStatus(currentTodos)}
              setFilter={setFilter}
              clearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setShowError={setShowError}
        showError={showError}
      />
    </div>
  );
};
