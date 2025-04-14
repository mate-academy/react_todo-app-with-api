/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterSelectEnum } from './types/FilterSelectType';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  //#region UseHooks
  const [generalTodos, setGeneralTodos] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterSelectEnum>(
    FilterSelectEnum.All,
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const allTodos = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isClearTodos = useRef<boolean>(false);
  const isToggle = useRef<boolean>(false);

  //#endregion

  //#region Function

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setErrorMessage('');
      setLoading(true);

      const todoToDelete = generalTodos.find(todo => todo.id === todoId);

      if (todoToDelete && !isClearTodos.current) {
        setSelectedTodo(todoToDelete);
      }

      try {
        await todoService.deleteTodo(todoId);
        setGeneralTodos(curentTodos =>
          curentTodos.filter(todo => todo.id !== todoId),
        );
        allTodos.current -= 1;
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
        throw error;
      } finally {
        inputRef.current?.focus();
        setLoading(false);
        setSelectedTodo(null);
        isClearTodos.current = false;
      }
    },
    [generalTodos],
  );

  const addTodo = useCallback(async ({ title, userId, completed }: Todo) => {
    setErrorMessage('');
    setLoading(true);
    setTodos(currentTodos => [
      ...currentTodos,
      { title, userId, completed, id: 0 },
    ]);

    try {
      const newTodo = await todoService.addTodo({ title, userId, completed });

      allTodos.current += 1;

      return newTodo;
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setLoading(false);
      setSelectedTodo(null);
    }
  }, []);

  const updateTodo = useCallback(async (todoToUpdate: Todo): Promise<Todo> => {
    setErrorMessage('');
    setLoading(true);
    setSelectedTodo(null);
    if (!isToggle.current) {
      setSelectedTodo(todoToUpdate);
    }

    try {
      const updatedTodo = await todoService.updateTodo(todoToUpdate);

      setGeneralTodos(current =>
        current.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );

      return updatedTodo;
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setLoading(false);
      setSelectedTodo(null);
      isToggle.current = false;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmiting(true);

      if (!newTodoTitle.trim()) {
        setErrorMessage('Title should not be empty');
        setIsSubmiting(false);

        return;
      }

      const tempTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        id: 0,
        userId: todoService.USER_ID,
      };

      setSelectedTodo(tempTodo);

      addTodo(tempTodo)
        .then(data => {
          if (data) {
            setGeneralTodos(current => [
              ...current.filter(todo => todo.id !== 0),
              data,
            ]);
            setNewTodoTitle('');
          }
        })
        .catch(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== tempTodo.id),
          );
        })
        .finally(() => {
          setTimeout(() => inputRef.current?.focus(), 0);
          setIsSubmiting(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newTodoTitle],
  );

  const handleUpdateTitle = useCallback(
    async (data: Todo) => {
      if (!data.title.trim().length) {
        await deleteTodo(data.id);
        setTimeout(() => setSelectedTodo(null), 0);

        return;
      }

      try {
        await updateTodo(data);

        return true;
      } catch {
        return false;
      }
    },
    [updateTodo, deleteTodo],
  );

  const handleUpdateCompleted = useCallback(
    async (data: Todo, bool: boolean = data.completed) => {
      const newObject = {
        title: data.title,
        completed: !bool,
        id: data.id,
        userId: data.userId,
      };

      updateTodo({ ...newObject });

      return newObject;
    },
    [updateTodo],
  );

  const checkTodoCompleted = useCallback(() => {
    return generalTodos.filter(todo => todo.completed).length;
  }, [generalTodos]);

  const handleToggleActivate = useCallback(() => {
    const toggleBoolean = checkTodoCompleted() === allTodos.current;

    isToggle.current = true;

    generalTodos.map(todo => {
      if (todo.completed === toggleBoolean) {
        handleUpdateCompleted(todo, toggleBoolean);
      }
    });
  }, [handleUpdateCompleted, generalTodos, checkTodoCompleted, allTodos]);

  const handleClearCompleted = useCallback(() => {
    isClearTodos.current = true;
    generalTodos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [generalTodos, deleteTodo]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [handleSubmit]);

  useEffect(() => {
    setErrorMessage('');
    const delayTimer = setTimeout(() => setLoading(true), 200);

    todoService
      .getTodos()
      .then(data => {
        allTodos.current = data.length;
        setGeneralTodos(data);
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        clearTimeout(delayTimer);
        setTimeout(() => setLoading(false), 500);
      });
  }, [addTodo]);

  useEffect(() => {
    setErrorMessage('');

    setTodos(
      generalTodos.filter(todo => {
        if (selectedFilter === FilterSelectEnum.Completed) {
          return todo.completed;
        }

        if (selectedFilter === FilterSelectEnum.Active) {
          return !todo.completed;
        }

        return true;
      }),
    );
  }, [selectedFilter, handleUpdateCompleted, generalTodos]);

  useEffect(() => {
    if (errorMessage.length) {
      const delayTimer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(delayTimer);
    }

    return;
  }, [errorMessage]);

  //#endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          allTodos={allTodos}
          isSubmiting={isSubmiting}
          newTodoTitle={newTodoTitle}
          handleSubmit={handleSubmit}
          setNewTodoTitle={setNewTodoTitle}
          checkTodoCompleted={checkTodoCompleted}
          handleToggleActivate={handleToggleActivate}
        />

        <TodoList
          todos={todos}
          loading={loading}
          inputRef={inputRef}
          selectedTodo={selectedTodo}
          deleteTodo={deleteTodo}
          handleUpdateTitle={handleUpdateTitle}
          handleUpdateCompleted={handleUpdateCompleted}
        />

        {Boolean(allTodos.current || todos.length) && (
          <Footer
            todos={todos}
            allTodos={allTodos}
            selectedFilter={selectedFilter}
            onSelectedFilter={setSelectedFilter}
            checkTodoCompleted={checkTodoCompleted}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
