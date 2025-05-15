/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodo, deleteTodo, updateTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterTypes } from './types/FilterTypes';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

export const USER_ID = 2811;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [inputValue, setInputValue] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(allTodos => {
        setTodos(allTodos);
      })
      .catch(() => setErrorMessage(ErrorMessage.LOAD_DATA))
      .finally(() => {
        setIsLoadingAll(false);
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (errorMessage !== ErrorMessage.NONE) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const visibleTodos: Todo[] = todos?.filter(todo => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return !todo.completed;
      case FilterTypes.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const allCompletedTodos: boolean = todos?.every(
    todo => todo.completed === true,
  );
  const uncompletedTodos: Todo[] = todos.filter(todo => !todo.completed);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = inputValue.trim();

    if (!trimedTitle) {
      setErrorMessage(ErrorMessage.TITLE_EMPTY);

      return;
    }

    const tempId = Date.now();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimedTitle,
      completed: false,
    };

    setLoadingIds(prev => [...prev, tempId]);
    setTempTodo(newTodo);
    postTodo(newTodo)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_ADD);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== tempId));
        setTempTodo(null);
      });
  };

  const handleClearCompleted = async () => {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    const successfulIds: number[] = [];

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        successfulIds.push(todo.id);
      } catch {
        setErrorMessage(ErrorMessage.UNABLE_DELETE);
      }
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );

    setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
    inputRef.current?.focus();
  };

  const handleDeleteTodo = (todoDelete: Todo) => {
    setLoadingIds(prev => [...prev, todoDelete.id]);

    deleteTodo(todoDelete.id)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos?.filter(todo => todo.id !== todoDelete.id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_DELETE);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoDelete.id));
        inputRef.current?.focus();
      });
  };

  const handleChecked = (todoToToggle: Todo) => {
    const todoToUpade = {
      ...todoToToggle,
      completed: !todoToToggle.completed,
    };

    setLoadingIds(prev => [...prev, todoToToggle.id]);
    updateTodo(todoToUpade)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoToUpade.id ? todoToUpade : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UNABLE_UPDATE);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoToToggle.id));
      });
  };

  const handleHiddeErrorMessage = () => {
    setErrorMessage(ErrorMessage.NONE);
  };

  const handleFilterType = (type: FilterTypes) => {
    setFilterType(type);
  };

  const handleUpdateTodoTitle = async (
    todoId: number,
    editedTitle: string,
  ): Promise<boolean> => {
    const trimmedTitle = editedTitle.trim();
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return false;
    }

    if (trimmedTitle === '') {
      setLoadingIds(id => [...id, todoToUpdate.id]);
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));

        return true;
      } catch {
        setErrorMessage(ErrorMessage.UNABLE_DELETE);

        return false;
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== todoToUpdate.id));
      }
    }

    const updatedTodo = { ...todoToUpdate, title: trimmedTitle };

    setLoadingIds(prev => [...prev, todoId]);

    try {
      await updateTodo(updatedTodo);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
        ),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessage.UNABLE_UPDATE);

      return false;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleCheckedAll = async () => {
    const shouldComplete = !todos.every(todo => todo.completed);
    const targetTodos = todos.filter(todo => todo.completed !== shouldComplete);
    const targetIds = targetTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...targetIds]);

    const updatedTodos: Todo[] = [];

    for (const todo of targetTodos) {
      const updatedTodo = { ...todo, completed: shouldComplete };

      try {
        await updateTodo(updatedTodo);
        updatedTodos.push(updatedTodo);
      } catch {
        setErrorMessage(ErrorMessage.UNABLE_UPDATE);
      }
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        targetIds.includes(todo.id)
          ? { ...todo, completed: shouldComplete }
          : todo,
      ),
    );

    setLoadingIds(prev => prev.filter(id => !targetIds.includes(id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addingTodo={tempTodo}
          inputValue={inputValue}
          inputRef={inputRef}
          allCompletedTodos={allCompletedTodos}
          isLoadingAll={isLoadingAll}
          todosCount={todos.length}
          handleSubmitForm={handleSubmitForm}
          handleInputValue={handleInputValue}
          handleCheckedAll={handleCheckedAll}
        />

        <TodosList
          todos={[...visibleTodos, ...(tempTodo ? [tempTodo] : [])]}
          handleDeleteTodo={handleDeleteTodo}
          handleChecked={handleChecked}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          loadingIds={loadingIds}
          isLoadingAll={isLoadingAll}
        />

        {/* Hide the footer if there are no todos */}
        {todos?.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            filterType={filterType}
            handleFilterType={handleFilterType}
            handleClearCompleted={handleClearCompleted}
            todos={todos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        handleHiddeErrorMessage={handleHiddeErrorMessage}
      />
    </div>
  );
};
