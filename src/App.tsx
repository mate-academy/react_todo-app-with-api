/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodos,
  toggleTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoForm } from './components/TodoForm/TodoForm';
import { Notification } from './components/Notification/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [status, setStatus] = useState(Status.all);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isFailed, setIsFailed] = useState(false);

  const onAutoCloseNotification = useCallback(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, []);
  const onCloseNotification = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setErrorMessage(null);
    },
    [],
  );

  const onSetStatus = useCallback((event: React.MouseEvent) => {
    const a = event.target as HTMLAnchorElement;
    const statusValue =
      (a.getAttribute('href')?.replace('#/', '') as Status) || Status.all;

    setStatus(statusValue);
  }, []);

  const visibleTodos = useMemo(() => {
    switch (status) {
      case Status.all:
        return todos;
      case Status.active:
        return todos.filter(todo => !todo.completed);
      case Status.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  const handleNewTodoForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessage.title);
      setTodoTitle('');
      onAutoCloseNotification();

      return;
    }

    setTempTodo({ title: todoTitle, userId: USER_ID, id: 0, completed: false });

    setIsProcessing(true);

    addTodo(todoTitle.trim())
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo as Todo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.add);
        onAutoCloseNotification();
      })
      .finally(() => {
        setIsProcessing(false);
        setTempTodo(null);
      });
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
    const toDeleteTodo: number[] = [];

    setSelectedTodoId(completedIds);

    try {
      await Promise.all(
        completedIds.map(async id => {
          try {
            await deleteTodo(id);
            toDeleteTodo.push(id);
          } catch (error) {
            setErrorMessage(ErrorMessage.delete);
            onAutoCloseNotification();
          }
        }),
      );
      setTodos(prevTodos =>
        prevTodos.filter(todo => !toDeleteTodo.includes(todo.id)),
      );
    } catch {
      setErrorMessage(ErrorMessage.delete);
      onAutoCloseNotification();
    } finally {
      setSelectedTodoId([]);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setSelectedTodoId([todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setSelectedTodoId([]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.delete);
        onAutoCloseNotification();
      })
      .finally(() => {
        setSelectedTodoId([]);
      });
  };

  const handleToggleTodo = async (id: number, index: number) => {
    const toToggleTodo = todos.find(todo => todo.id === id);

    if (!toToggleTodo) {
      return;
    }

    const { completed } = toToggleTodo;

    try {
      setIsProcessing(true);
      setSelectedTodoId([id]);
      const updatedTodo = await toggleTodo(id, completed);

      setTodos(prev => {
        const newTodos = [...prev];

        newTodos.splice(index, 1, updatedTodo as Todo);

        return newTodos;
      });
    } catch {
      setErrorMessage(ErrorMessage.update);
    } finally {
      setIsProcessing(false);
      onAutoCloseNotification();
      setSelectedTodoId([]);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const completed = !allCompleted;
    const updatedIds = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    setSelectedTodoId(updatedIds);
    setIsProcessing(true);

    try {
      await Promise.all(
        todos
          .filter(todo => todo.completed !== completed)
          .map(async todo => toggleTodo(todo.id, completed)),
      );
      setTodos(prevTodos => prevTodos.map(todo => ({ ...todo, completed })));
    } catch {
      setErrorMessage(ErrorMessage.update);
    } finally {
      setIsProcessing(false);
      setSelectedTodoId([]);
    }
  };

  const handleStartEdit = (prevTitle: string, id: number) => {
    if (isFailed) {
      return;
    }

    setIsEditing(id);
    setNewTodoTitle(prevTitle);
  };

  const handleEditTitle = async (
    event: React.FormEvent,
    todo: Todo,
    index: number,
  ) => {
    event.preventDefault();

    const { title, id } = todo;

    if (title === newTodoTitle) {
      setIsEditing(null);
      setNewTodoTitle('');

      return;
    }

    if (!newTodoTitle.trim()) {
      handleDeleteTodo(id);

      return;
    }

    try {
      setSelectedTodoId([id]);

      const updatedTodo = await editTodo(id, newTodoTitle.trim());

      setTodos(prev => {
        const newTodos = [...prev];

        newTodos.splice(index, 1, updatedTodo as Todo);

        return newTodos;
      });

      setNewTodoTitle('');
      setIsEditing(null);
      setIsFailed(false);
    } catch {
      setErrorMessage(ErrorMessage.update);
      onAutoCloseNotification();
      setIsFailed(true);
    } finally {
      setSelectedTodoId([]);
    }
  };

  const handleKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(null);
      setNewTodoTitle('');
    }
  };

  useEffect(() => {
    getTodos()
      .then(downloadedTodos => {
        setTodos(downloadedTodos);
        setIsProcessing(true);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.load);
        onAutoCloseNotification();
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, []);
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          todoTitle={todoTitle}
          isProcessing={isProcessing}
          tempTodo={tempTodo}
          onNewTodo={handleNewTodoForm}
          onTodoTitle={setTodoTitle}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          selectedTodoId={selectedTodoId}
          tempTodo={tempTodo}
          isEditing={isEditing}
          newTitle={newTodoTitle}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onStartEditing={handleStartEdit}
          onNewTodoTitle={setNewTodoTitle}
          onChangeTodoTitle={handleEditTitle}
          onKey={handleKey}
        />

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            status={status}
            onSetStatus={onSetStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onCloseNotification={onCloseNotification}
      />
    </div>
  );
};
