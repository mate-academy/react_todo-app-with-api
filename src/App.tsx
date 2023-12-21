import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TodoMain } from './components/TodoMain';
import { TodoHeader } from './components/TodoHeader';
import { FilterType } from './types/FilterType';
import { TodoNotification } from './components/TodoNotification';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { ErrorType } from './types/ErrorType';

const USER_ID = 12031;

const filterTodos = (sourceTodos: Todo[], filterBy: FilterType) => {
  let filteredTodos: Todo[];

  switch (filterBy) {
    case FilterType.Active:
      filteredTodos = sourceTodos.filter(todo => !todo.completed);
      break;

    case FilterType.Completed:
      filteredTodos = sourceTodos.filter(todo => todo.completed);
      break;

    default:
      filteredTodos = [...sourceTodos];
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<FilterType>(FilterType.All);

  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [
    currentError,
    setCurrentError,
  ] = useState<ErrorType>(ErrorType.NoError);

  const timerId = useRef<NodeJS.Timeout>();

  const onError = (error: ErrorType) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setCurrentError(error);
    timerId.current = setTimeout(
      () => setCurrentError(ErrorType.NoError),
      3000,
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    newTodoText: string,
    setNewTodoText: Dispatch<SetStateAction<string>>,
  ) => {
    event.preventDefault();

    if (!newTodoText.trim()) {
      onError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoText.trim(),
      completed: false,
    };

    try {
      setTempTodo(() => newTodo);
      await addTodo(newTodo)
        .then((todo) => setTodosFromServer(
          prevTodos => ([...prevTodos, todo]),
        ))
        .then(() => {
          setNewTodoText('');
        });
    } catch {
      onError(ErrorType.UnableToAdd);
    } finally {
      setTempTodo(() => null);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSingleTodoDelition = async (todoId: number) => {
    try {
      setSelectedTodoIds(prevIds => [...prevIds, todoId]);

      await deleteTodo(todoId).then(() => {
        setTodosFromServer(
          prevTodos => prevTodos.filter(todo => todo.id !== todoId),
        );
      });
    } catch {
      onError(ErrorType.UnableToDelete);
    } finally {
      setTimeout(
        () => {
          setSelectedTodoIds(ids => {
            const idsCopy = [...ids];

            idsCopy.splice(ids.indexOf(todoId), 1);

            return idsCopy;
          });

          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
        300,
      );
    }
  };

  const completedTodoIds = todosFromServer
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const handleCompletedTodosDelition = async () => {
    const processedIds: number[] = [];

    try {
      setSelectedTodoIds(prev => [...prev, ...completedTodoIds]);

      completedTodoIds.forEach(async (todoId) => {
        await deleteTodo(todoId).catch(() => onError(ErrorType.UnableToDelete))
          .then(() => {
            processedIds.push(todoId);
          });
      });
    } catch {
      onError(ErrorType.UnableToDelete);
    } finally {
      setTimeout(
        () => {
          setSelectedTodoIds(
            ids => ids.filter(id => !completedTodoIds.includes(id)),
          );

          setTodosFromServer(
            todos => todos.filter(todo => !processedIds.includes(todo.id)),
          );

          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
        300,
      );
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      setSelectedTodoIds(prevIds => [...prevIds, updatedTodo.id]);

      await patchTodo(updatedTodo)
        .then((todoFromResponse: Todo) => {
          const todos = todosFromServer;
          const indexOfTodo = todos.findIndex(
            todo => todo.id === todoFromResponse.id,
          );

          todos[indexOfTodo] = todoFromResponse;

          setTodosFromServer([...todos]);
        })
        .catch(() => onError(ErrorType.UnableToUpdate));
    } catch {
      onError(ErrorType.UnableToUpdate);
    } finally {
      setSelectedTodoIds(
        ids => {
          const idsCopy = [...ids];

          idsCopy.splice(idsCopy.indexOf(updatedTodo.id), 1);

          return idsCopy;
        },
      );
    }
  };

  useEffect(() => {
    setCurrentError(ErrorType.NoError);
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => (onError(ErrorType.UnableToLoad)));
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todosFromServer, selectedFilter),
    [todosFromServer, selectedFilter],
  );

  const activeTodos = todosFromServer.filter(todo => !todo.completed);
  const activeTodoIds = activeTodos.map(todo => todo.id);
  const activeTodosCount = activeTodos.length;

  const handleToggleAll = async () => {
    const todos = todosFromServer;

    if (activeTodosCount) {
      setSelectedTodoIds(prev => [...prev, ...activeTodoIds]);

      try {
        activeTodos.forEach(async todo => {
          const updatedTodo = {
            ...todo,
            completed: true,
          };

          await patchTodo(updatedTodo).then((todoFromResponse: Todo) => {
            const indexOfTodo = todos.findIndex(
              td => td.id === todoFromResponse.id,
            );

            todos[indexOfTodo] = todoFromResponse;
          });
        });
      } catch {
        onError(ErrorType.UnableToUpdate);
      } finally {
        setTimeout(
          () => {
            setSelectedTodoIds(
              ids => ids.filter(id => !activeTodoIds.includes(id)),
            );

            setTodosFromServer([...todos]);
          },
          300,
        );
      }
    } else {
      setSelectedTodoIds(prev => [...prev, ...completedTodoIds]);

      try {
        todosFromServer.forEach(async todo => {
          const updatedTodo = {
            ...todo,
            completed: false,
          };

          await patchTodo(updatedTodo).then((todoFromResponse: Todo) => {
            const indexOfTodo = todos.findIndex(
              td => td.id === todoFromResponse.id,
            );

            todos[indexOfTodo] = todoFromResponse;
          });
        });
      } catch {
        onError(ErrorType.UnableToUpdate);
      } finally {
        setTimeout(
          () => {
            setSelectedTodoIds(
              ids => ids.filter(id => !completedTodoIds.includes(id)),
            );

            setTodosFromServer([...todos]);
          },
          300,
        );
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodoListEmpty={!todosFromServer.length}
          isAnyTodoActive={!!activeTodosCount}
          isNewLoading={!!tempTodo}
          handleSubmit={handleSubmit}
          handleToggleAll={handleToggleAll}
          inputRef={inputRef}
        />

        <TodoMain
          onError={onError}
          todos={filteredTodos}
          tempTodo={tempTodo}
          selectedTodoIds={selectedTodoIds}
          onDelete={handleSingleTodoDelition}
          updateTodo={updateTodo}
        />

        {(todosFromServer.length !== 0 || tempTodo) && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            isAnyTodoCompleted={activeTodosCount !== todosFromServer.length}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={handleCompletedTodosDelition}
          />
        )}
      </div>

      <TodoNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
      />
    </div>
  );
};
