/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/header';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';
import {
  createTodos,
  getTodos,
  removeTodos,
  updateTodos,
  updateTodosStatus,
} from './api/todos';
import { ErrorType } from './types/ErrorMessage';
import { Footer } from './components/footer';
import { TempTodo } from './components/TempTodo';
import { ErrorNotification } from './components/notification';

const USER_ID = 11356;

function getFilteredTodos(
  todos: Todo[],
  sortBy: string,
) {
  switch (sortBy) {
    case Status.ACTIVE:
      return todos.filter(todo => todo.completed === false);

    case Status.COMPLETED:
      return todos.filter(todo => todo.completed === true);

    case Status.ALL:
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);
  const [isMessageClosed, setIsMessageClosed] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInProcces, setIsInProcces] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LoadingError);
        setIsMessageClosed(false);
        setTimeout(() => {
          setIsMessageClosed(true);
        }, 3000);
      });
  }, []);

  const filteredTodos = getFilteredTodos(todos, status);
  const itemsLeft = getFilteredTodos(todos, Status.ACTIVE);
  const completedTodos = getFilteredTodos(todos, Status.COMPLETED);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorType.None);
    setIsMessageClosed(false);

    if (newTitle.trim().length === 0) {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    setIsLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    createTodos({ userId: USER_ID, title: newTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorType.AddError);
      })
      .finally(() => {
        setNewTitle('');
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodo = (id: number) => {
    setErrorMessage(ErrorType.None);
    setIsMessageClosed(false);

    setIsLoading(true);
    setIsInProcces(curentId => [...curentId, id]);

    removeTodos(id)
      .then(() => {
        setTodos(todos.filter(CurentTodo => id !== CurentTodo.id));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DeleteError);
      })
      .finally(() => {
        setIsLoading(false);
        setIsInProcces([]);
      });
  };

  const ClearCompletedHendlere = useCallback(() => {
    setIsInProcces(completedTodos.map(todo => todo.id));
    Promise.all(completedTodos.map(todo => (
      removeTodos(todo.id)
    )))
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DeleteError);
      })
      .finally(() => setIsInProcces([]));
  }, [todos]);

  const inputHendlere = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    setIsMessageClosed(true);
  };

  const handleTodoStatus = async (todoId: number, completed: boolean) => {
    try {
      setIsInProcces(curentId => [...curentId, todoId]);
      await updateTodosStatus(todoId, completed);
      setTodos(curentTodos => curentTodos.map(todo => (todo.id === todoId ? { ...todo, completed } : todo)));
    } catch {
      setErrorMessage(ErrorType.UpduteError);
    } finally {
      setIsInProcces([]);
    }
  };

  const handleToggleTodosAll = () => (
    itemsLeft.length > 0
      ? todos.map(todo => todo.completed === false && (handleTodoStatus(todo.id, !todo.completed)))
      : todos.map(todo => (handleTodoStatus(todo.id, !todo.completed)))
  );

  const editTodo = async (todoId: number, title: string) => {
    try {
      if (title.trim().length === 0) {
        deleteTodo(todoId);

        return;
      }

      if (title === todos.find(todo => todo.id === todoId)?.title) {
        setIsEditing(null);

        return;
      }

      setIsInProcces(curentId => [...curentId, todoId]);
      await updateTodos(todoId, title);
      setTodos(curentTodos => curentTodos.map(todo => (todo.id === todoId ? { ...todo, title } : todo)));
    } catch {
      setErrorMessage(ErrorType.UpduteError);
    } finally {
      setIsInProcces([]);
    }
  };

  const editingHandler = (todoId: number) => {
    editTodo(todoId, editingTitle);
    setIsEditing(null);
  };

  const cancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          itemsLeft={itemsLeft}
          handleToggleTodosAll={handleToggleTodosAll}
          isLoading={isLoading}
          inputHendlere={inputHendlere}
          newTitle={newTitle}
          addTodo={addTodo}
        />

        <section className="todoapp__main">
          <TodoList
            filteredTodos={filteredTodos}
            handleTodoStatus={handleTodoStatus}
            isEditing={isEditing}
            editingHandler={editingHandler}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            cancelEdit={cancelEdit}
            setIsEditing={setIsEditing}
            deleteTodo={deleteTodo}
            isInProcces={isInProcces}
          />

          {tempTodo !== null && <TempTodo tempTodo={tempTodo} />}
        </section>

        {
          todos.length > 0 && (
            <Footer
              ClearCompletedHendlere={ClearCompletedHendlere}
              setStatus={setStatus}
              itemsLeft={itemsLeft}
              status={status}
              completedTodos={completedTodos}
            />
          )
        }
      </div>

      {errorMessage && (
        <ErrorNotification
          isMessageClosed={isMessageClosed}
          setIsMessageClosed={setIsMessageClosed}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
