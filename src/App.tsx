/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeFilter, setTypeFilter] = useState<FilterType>(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NoError,
  );
  const [titleInput, setTitleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [idsProcessing, setIdsProcessing] = useState<number | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(ErrorMessage.NoError), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  function handleCreateTodo(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setIsLoading(true);

    createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleInput('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  const handleEditTodo = async (id: number, data: Partial<Todo>) => {
    setIsLoading(true);
    setIdsProcessing(id);

    return updateTodo(id, data)
      .then(editedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === id) {
              return editedTodo;
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdate);

        return { error: true };
      })
      .finally(() => {
        setIsLoading(false);
        setIdsProcessing(null);
      });
  };

  function handleDeleteTodo(todoId: number) {
    setIsLoading(true);
    setIdsProcessing(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToDelete))
      .finally(() => {
        setIsLoading(false);
        setIdsProcessing(null);
      });
  }

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => todo.completed);

    setLoadingIds([...activeTodos.map(todo => todo.id)]);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(value => {
          if (value.status === 'rejected') {
            setErrorMessage(ErrorMessage.UnableToDelete);
          } else {
            setTodos(prevTodos => {
              const todoID = value.value as Todo;

              return prevTodos.filter(todo => todo.id !== todoID.id);
            });
          }
        });
      })
      .finally(() => setLoadingIds([]));
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  function handleToggleAll() {
    if (activeTodos.length) {
      setLoadingIds([...activeTodos.map(todo => todo.id)]);
      Promise.all(
        activeTodos.map(todo => {
          return updateTodo(todo.id, {
            ...todo,
            completed: true,
          });
        }),
      )
        .then(() =>
          setTodos(prevTodos =>
            prevTodos.map(item =>
              item.completed ? item : { ...item, completed: true },
            ),
          ),
        )
        .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
        .finally(() => setLoadingIds([]));

      return;
    }

    setLoadingIds([...todos.map(todo => todo.id)]);
    Promise.all(
      completedTodos.map(todo => {
        return updateTodo(todo.id, {
          ...todo,
          completed: false,
        });
      }),
    )
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.map(item => ({ ...item, completed: false })),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
      .finally(() => setLoadingIds([]));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Your todos</h1>

      <div className="todoapp__content">
        <Header
          titleInput={titleInput}
          setTitleInput={setTitleInput}
          handleCreateTodo={handleCreateTodo}
          isLoading={isLoading}
          onToggleAll={handleToggleAll}
          todos={todos}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={todos}
          typeFilter={typeFilter}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          tempTodo={tempTodo}
          idsProcessing={idsProcessing}
          onEdit={handleEditTodo}
          loadingIds={loadingIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            isAllActive={todos.every(todo => !todo.completed)}
            onDeleteCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
