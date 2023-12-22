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
import { filterTodos } from './utils/filterTodos';

const USER_ID = 12031;

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
  ] = useState<ErrorType | null>(null);

  const timerId = useRef<NodeJS.Timeout>();

  const onError = (error: ErrorType) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setCurrentError(error);
    timerId.current = setTimeout(
      () => setCurrentError(null),
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
      setTempTodo(newTodo);
      const todo = await addTodo(newTodo);

      setTodosFromServer(
        todos => ([...todos, todo]),
      );

      setNewTodoText('');
    } catch {
      onError(ErrorType.UnableToAdd);
    } finally {
      setTempTodo(null);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSingleTodoDelition = async (todoId: number) => {
    try {
      setSelectedTodoIds(ids => [...ids, todoId]);

      await deleteTodo(todoId);

      setTodosFromServer(
        todos => todos.filter(todo => todo.id !== todoId),
      );
    } catch {
      onError(ErrorType.UnableToDelete);
    } finally {
      setTimeout(
        () => {
          setSelectedTodoIds(
            ids => ids.filter(id => !(id === todoId)),
          );

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
    try {
      setSelectedTodoIds(ids => [...ids, ...completedTodoIds]);

      await Promise.all(completedTodoIds.map(async (todoId) => {
        try {
          await deleteTodo(todoId);
          setTodosFromServer(
            todos => todos.filter(todo => !(todo.id === todoId)),
          );
        } catch {
          onError(ErrorType.UnableToDelete);
        }
      }));
    } finally {
      setTimeout(
        () => {
          setSelectedTodoIds(
            ids => ids.filter(id => !completedTodoIds.includes(id)),
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
      setSelectedTodoIds(ids => [...ids, updatedTodo.id]);

      const todoFromResponse = await patchTodo(updatedTodo);

      setTodosFromServer(
        todos => todos.map(td => {
          if (td.id === todoFromResponse.id) {
            return todoFromResponse;
          }

          return td;
        }),
      );
    } catch {
      onError(ErrorType.UnableToUpdate);
      throw new Error();
      // ^ this error throw is needed to trigger catch
      // in onSubmitTitle (TodoItem.tsx)
      // "Edit Form √ should stay open on fail"
    } finally {
      setSelectedTodoIds(
        ids => ids.filter(id => !(id === updatedTodo.id)),
      );
    }
  };

  useEffect(() => {
    setCurrentError(null);
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
    if (activeTodosCount) {
      setSelectedTodoIds(ids => [...ids, ...activeTodoIds]);

      await Promise.all(activeTodos.map(async (todo) => {
        try {
          const updatedTodo = {
            ...todo,
            completed: true,
          };

          await updateTodo(updatedTodo);
        } catch {
          onError(ErrorType.UnableToUpdate);
        }
      }));
    } else {
      setSelectedTodoIds(ids => [...ids, ...completedTodoIds]);

      await Promise.all(todosFromServer.map(async (todo) => {
        try {
          const updatedTodo = {
            ...todo,
            completed: false,
          };

          await updateTodo(updatedTodo);
        } catch {
          onError(ErrorType.UnableToUpdate);
        }
      }));
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
