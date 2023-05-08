/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback, FormEvent, FocusEvent,
} from 'react';

import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notification } from './components/Notification/Notification';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { TodoErrors } from './types/TodoErrors';
import {
  getTodos, USER_ID, createTodo, deleteTodo, toggleTodo, changeTitle,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [selectedId, setSeletedId] = useState<number | null>(null);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const resetTodoData = (): void => {
    setIsProcessed(false);
    setNewTitle('');
    setEditedTodoId(null);
    setSeletedId(null);
    setTitle('');
  };

  const deleteTodoHandler = useCallback(async (
    todoId: number,
  ) => {
    setSeletedId(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(filtredTodos => filtredTodos
        .filter(todo => todo.id !== todoId));
    } catch (innerError) {
      setError(TodoErrors.Delete);
    } finally {
      setSeletedId(null);
    }
  }, []);

  const createTodoHandler = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(TodoErrors.Empty);
    } else {
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: USER_ID,
      });

      try {
        const todo = await createTodo(USER_ID, title);

        setIsProcessed(true);

        if (todo) {
          setTempTodo(null);
          setTodos([...todos, todo]);
        }
      } catch (innerError) {
        setError(TodoErrors.Add);
      } finally {
        resetTodoData();
      }
    }
  }, [title]);

  const toggleTodoHandler = async (todoId: number, check: boolean) => {
    setSeletedId(todoId);

    try {
      await toggleTodo(todoId, !check);
      setTodos(todos.map(todo => (todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : todo
      )));
    } catch (innerError) {
      setError(TodoErrors.Update);
    } finally {
      setSeletedId(null);
    }
  };

  const toggleAllTodoHandler = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const completed = !allCompleted;

    setIsProcessed(true);

    try {
      await Promise.all(
        todos.filter(todo => todo.completed !== completed)
          .map(async todo => toggleTodo(todo.id, completed)),
      );
      setTodos(todos.map(todo => ({ ...todo, completed })));
    } catch (innerError) {
      setError(TodoErrors.Update);
    } finally {
      setIsProcessed(false);
    }
  };

  const clearCompletedTodos = async () => {
    const completeTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completeTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));
      setTodos(filtredTodos => filtredTodos
        .filter(filtrTodo => !filtrTodo.completed));
    } catch (innerError) {
      setError(TodoErrors.Delete);
    }
  };

  const changeTodoTitleHandler = async (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) => {
    if (!editedTodoId) {
      return;
    }

    event.preventDefault();
    setSeletedId(editedTodoId);

    try {
      if (!newTitle.trim()) {
        await deleteTodo(editedTodoId);
        setTodos(filtredTodos => filtredTodos
          .filter(todo => todo.id !== editedTodoId));
      } else {
        await changeTitle(editedTodoId, newTitle);
        setTodos(innerTodos => innerTodos.map(todo => (todo.id === editedTodoId
          ? { ...todo, title: newTitle }
          : todo)));
      }

      resetTodoData();
    } catch (innerError) {
      setError(TodoErrors.Update);
    } finally {
      setSeletedId(null);
    }
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const itemsCompleted = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    let timeout: number;

    if (error) {
      timeout = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const filtredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.All:
        return todos;
      case TodoStatus.Active:
        return todos.filter((todo) => !todo.completed);
      case TodoStatus.Completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
      } catch (innerError) {
        setError(TodoErrors.Get);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAnyTodo={todos.length > 0}
          activeTodos={itemsLeft}
          title={title}
          isProcessed={isProcessed}
          onAddTodo={createTodoHandler}
          onToggleAll={toggleAllTodoHandler}
          onAddTitle={setTitle}
        />

        <TodoList
          todos={filtredTodos}
          creating={tempTodo}
          onDelete={deleteTodoHandler}
          selectedId={selectedId}
          onToggle={toggleTodoHandler}
          editedTodoId={editedTodoId}
          onEditedTodoId={setEditedTodoId}
          onAddNewTitle={setNewTitle}
          onChangeTodoTitle={changeTodoTitleHandler}
          newTitle={newTitle}
        />

        {todos.length !== 0
          && (
            <TodoFilter
              onStatusChanged={setStatus}
              status={status}
              itemsLeft={itemsLeft}
              itemsCompleted={itemsCompleted}
              clearCompletedTodos={clearCompletedTodos}
            />
          )}
      </div>

      <Notification
        onClose={setError}
        error={error}
      />
    </div>
  );
};
