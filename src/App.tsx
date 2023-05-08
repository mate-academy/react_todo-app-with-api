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

  const deleteTodoHandler = useCallback((todoId: number) => {
    setSeletedId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(filtredTodos => filtredTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(TodoErrors.Delete))
      .finally(() => setSeletedId(null));
  }, []);

  const createTodoHandler = useCallback((
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
      createTodo(USER_ID, title)
        .then((todo) => {
          if (todo) {
            setTempTodo(null);
            setTodos([...todos, todo]);
          }
        })
        .catch(() => {
          setError(TodoErrors.Add);
        })
        .finally(() => {
          setIsProcessed(false);
          setTitle('');
        });
      setIsProcessed(true);
    }
  }, [title]);

  const toggleTodoHandler = (todoId: number, check: boolean) => {
    setSeletedId(todoId);

    toggleTodo(todoId, !check)
      .then(() => {
        setTodos(todos.map(todo => (todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo)));
      })
      .catch(() => setError(TodoErrors.Update))
      .finally(() => setSeletedId(null));
  };

  const toggleAllTodoHandler = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const completed = !allCompleted;

    setIsProcessed(true);

    Promise.all(
      todos.filter(todo => todo.completed !== completed)
        .map(todo => toggleTodo(todo.id, completed)),
    )
      .then(() => {
        setTodos(todos.map(todo => ({ ...todo, completed })));
        setIsProcessed(false);
      })
      .catch(() => setError(TodoErrors.Update));
  };

  const clearCompletedTodos = () => {
    const completeTodos = todos.filter(todo => todo.completed);

    return completeTodos
      .map(todo => deleteTodo(todo.id)
        .then(() => setTodos(filtredTodos => filtredTodos
          .filter(filtrTodo => !filtrTodo.completed)))
        .catch(() => setError(TodoErrors.Delete)));
  };

  const changeTodoTitleHandler = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    if (!editedTodoId) {
      return;
    }

    setSeletedId(editedTodoId);

    if (!newTitle.trim()) {
      deleteTodo(editedTodoId)
        .then(() => {
          setTodos(filtredTodos => filtredTodos
            .filter(todo => todo.id !== editedTodoId));
        })
        .catch(() => setError(TodoErrors.Delete))
        .finally(() => {
          setSeletedId(null);
          setEditedTodoId(null);
        });
    } else {
      changeTitle(editedTodoId, newTitle)
        .then(() => {
          setTodos(
            todos.map((todo) => (
              todo.id === editedTodoId
                ? { ...todo, title: newTitle }
                : todo
            )),
          );
        })
        .finally(() => {
          setIsProcessed(false);
          setNewTitle('');
          setEditedTodoId(null);
          setSeletedId(null);
        })
        .catch(() => setError(TodoErrors.Update));
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
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        setError(TodoErrors.Get);
      });
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
