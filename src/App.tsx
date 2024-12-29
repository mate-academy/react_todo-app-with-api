/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Todo, TodoResponse } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ErrorType } from './types/ErrorType';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorState, setErrorState] = useState<ErrorType>(ErrorType.Default);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [title, setTitle] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputEditRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [todoChangedTitle, setTodoChangedTitle] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([0]);

  const trimmedTitle = title.trim();

  const setError = (errorType: ErrorType) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorState(errorType);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorState(ErrorType.Default);
      errorTimeoutRef.current = null;
    }, 3000);
  };

  const filteredTodos = useMemo((): Todo[] => {
    return filterTodos(todos, filterType);
  }, [filterType, todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAllCompleted(false);

    if (!trimmedTitle.length) {
      setError(ErrorType.Input);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsInputDisabled(true);

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then((response: TodoResponse) => {
        const { userId, id, title: titleTodo, completed } = response;

        setTodos(currentTodos => [
          ...currentTodos,
          { userId, id, title: titleTodo, completed },
        ]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorType.Add);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoID: number | null) => {
    setIsInputDisabled(true);

    if (todoID) {
      setLoadingTodoIds(currentIds => [...currentIds, todoID]);
    }

    deleteTodo(todoID)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoID),
        );
      })
      .catch(() => {
        setError(ErrorType.Delete);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoID));
      });
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleToggleAll = async (state: boolean) => {
    const patchPromises: Promise<Todo>[] = [];

    for (const todo of todos) {
      if (!state && todo.completed) {
        continue;
      }

      const updatedTodo: Todo = {
        ...todo,
        completed: !state,
      };

      const patchPromise = patchTodo(todo.id, updatedTodo);

      patchPromises.push(patchPromise);

      setLoadingTodoIds(currentTodos => [...currentTodos, updatedTodo.id]);
    }

    try {
      const patchedTodos = await Promise.all(patchPromises);

      setTodos(currentTodos =>
        currentTodos.map(
          todo => patchedTodos.find(patched => patched.id === todo.id) || todo,
        ),
      );

      setIsAllCompleted(!isAllCompleted);
    } catch (error) {
      setError(ErrorType.Update);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleCompletedTodo = async (chosenTodo: Todo) => {
    setLoadingTodoIds(currentIds => [...currentIds, chosenTodo.id]);

    const updatedTodo: Todo = {
      ...chosenTodo,
      completed: !chosenTodo.completed,
    };

    try {
      const patchedTodo = await patchTodo(chosenTodo.id, updatedTodo);

      setTodos(currentTodos => {
        const updatedTodos = currentTodos.map(todo =>
          todo.id === patchedTodo.id ? patchedTodo : todo,
        );

        setIsAllCompleted(updatedTodos.every(todo => todo.completed));

        return updatedTodos;
      });
    } catch (error) {
      setError(ErrorType.Update);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleDoubleClickTodo = (chosenTodo: Todo) => {
    setTodoChangedTitle(chosenTodo);
    setLoadingTodoIds(currentIds => [...currentIds, chosenTodo.id]);
  };

  const handleSubmitEdit = async (
    titleEdit: string,
    event: React.FormEvent<HTMLFormElement> | null = null,
  ) => {
    event?.preventDefault();

    const trimmedTitleEdit = titleEdit.trim();
    const prevTodo = todos.find(todo => todo.id === todoChangedTitle?.id);

    if (!trimmedTitleEdit) {
      handleDeleteTodo(todoChangedTitle?.id || null);

      return;
    }

    if (
      todoChangedTitle &&
      prevTodo &&
      trimmedTitleEdit &&
      trimmedTitleEdit !== prevTodo.title
    ) {
      const updatedTodo: Todo = {
        ...todoChangedTitle,
        title: trimmedTitleEdit,
      };

      try {
        const patchedTodo = await patchTodo(todoChangedTitle.id, updatedTodo);

        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === patchedTodo.id ? patchedTodo : todo,
          );
        });
        setTodoChangedTitle(null);
      } catch (error) {
        setError(ErrorType.Update);
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoChangedTitle.id),
        );
      } finally {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoChangedTitle.id),
        );
      }
    } else {
      setTodoChangedTitle(null);
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => id !== todoChangedTitle?.id),
      );
    }
  };

  const handleBlurEdit = async (titleEdit: string) => {
    await handleSubmitEdit(titleEdit);
  };

  const handleCancelEdit = () => {
    setTodoChangedTitle(null);
  };

  useEffect(() => {
    getTodos()
      .then(responses => {
        setTodos(responses);
        setIsAllCompleted(responses.every(todo => todo.completed));
      })
      .catch(() => {
        setError(ErrorType.Load);
      });
  }, []);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          inputRef={inputRef}
          title={title}
          isInputDisabled={isInputDisabled}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          setTitle={setTitle}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          todoChangedTitle={todoChangedTitle}
          inputEditRef={inputEditRef}
          loadingTodoIds={loadingTodoIds}
          onDeleteTodo={handleDeleteTodo}
          onCompletedTodo={handleCompletedTodo}
          onDoubleClickTodo={handleDoubleClickTodo}
          onSubmitEdit={handleSubmitEdit}
          onCancelEdit={handleCancelEdit}
          handleBlurEdit={handleBlurEdit}
        />

        {!todos.length || (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorState={errorState} />
    </div>
  );
};
