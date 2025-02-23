/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessages } from './types/ErrorMessages';
import { getVisibleToDos } from './utils/getVisibleToDos';
import { Header } from './components/Header/Header';
import { ToDoList } from './components/ToDoList/ToDoList';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';

import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { createTodo } from './api/todos';
import { deleteTodo } from './api/todos';
import { updateToDo } from './api/todos';

export const App: React.FC = () => {
  const ERRORS: ErrorMessages = {
    LOAD_TODOS: 'Unable to load todos',
    TITLE_EMPTY: 'Title should not be empty',
    ADD_TODO: 'Unable to add a todo',
    DELETE_TODO: 'Unable to delete a todo',
    UPDATE_TODO: 'Unable to update a todo',
  };

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ERRORS.LOAD_TODOS);
      });
  }, [ERRORS.LOAD_TODOS]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => setError(''), 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [error]);

  const visibleToDos = useMemo(
    () => getVisibleToDos(todos, status),
    [todos, status],
  );

  const addTodo = (toDoTitle: string) => {
    const newTitle = toDoTitle.trim();

    if (!newTitle) {
      setError(ERRORS.TITLE_EMPTY);

      return;
    }

    setIsLoading(true);

    const newToDo = { id: 0, title: newTitle, completed: false };

    setTempTodo(newToDo);

    return createTodo(newToDo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setError(ERRORS.ADD_TODO))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodoById = (id: number) => {
    setIsLoading(true);

    return deleteTodo(id)
      .then(() => {
        setTodos(toDoState => toDoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ERRORS.DELETE_TODO);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateToDoByID = (
    id: number,
    updatedToDo: Partial<Todo>,
    onSuccess?: (res: Todo) => void,
    onFail?: () => void,
  ) => {
    return updateToDo(id, updatedToDo)
      .then(res => {
        setTodos(state =>
          state.map(todo =>
            todo.id === id ? { ...todo, ...updatedToDo } : todo,
          ),
        );

        if (onSuccess) {
          onSuccess(res);
        }
      })
      .catch(() => {
        setError(ERRORS.UPDATE_TODO);
        if (onFail) {
          onFail();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteCompleted = () => {
    setIsLoading(true);
    const promises: Promise<void>[] = [];

    todos.forEach(todo => {
      if (!todo.completed) {
        return;
      }

      promises.push(
        deleteTodo(todo.id)
          .then(() =>
            setTodos(prevTodos => prevTodos.filter(el => el.id !== todo.id)),
          )
          .catch(() => setError(ERRORS.DELETE_TODO)),
      );
    });
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToDoSave={addTodo}
          onTitleChange={setTitle}
          initialTitle={title}
          isLoading={isLoading}
          todos={todos}
          onUpdate={updateToDoByID}
          setIsAllLoading={setIsAllLoading}
        />
        <ToDoList
          visibleToDos={visibleToDos}
          onDelete={deleteTodoById}
          onUpdate={updateToDoByID}
          tempTodo={tempTodo}
          isAllLoading={isAllLoading}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompleteTodo={handleDeleteCompleted}
          />
        )}
      </div>
      <Error error={error} setError={setError} />
    </div>
  );
};
