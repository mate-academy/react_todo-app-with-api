import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Loader } from './components/Loader/Loader';
import { Header } from './components/Header/Header';
import { Todo, TodoStatus } from './types/Todo';
import { ERROR_MESSAGES } from './constants/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [title, setTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const [status, setStatus] = useState<TodoStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [processingTodosIds, setProcessingTodosIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  //завантаження тудушок
  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ERROR_MESSAGES.load);
      })
      .finally(() => setLoading(false));
  }, []);

  //автоматичне приховування помилок
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  //фокус після створення тудушки
  useEffect(() => {
    if (tempTodo === null && processingTodosIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingTodosIds]);

  const filteredTodos = useMemo(
    () => getFilteredTodos({ todos, status }),
    [todos, status],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (normalizedTitle === '') {
      setError(ERROR_MESSAGES.emptyTitle);

      return;
    }

    setError('');

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    });

    try {
      const todo = await postTodo(normalizedTitle);

      setTodos(currentTodo => [...currentTodo, todo]);
      setTitle('');
    } catch {
      setError(ERROR_MESSAGES.add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setError('');
    setProcessingTodosIds([todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError(ERROR_MESSAGES.delete);
      throw err;
    } finally {
      setProcessingTodosIds([]);
    }
  };

  const handleClearCompleted = () => {
    setError('');

    const completedTodos = todos.filter(todo => todo.completed);
    const deleteRequests = completedTodos.map(todo => deleteTodo(todo.id));

    setProcessingTodosIds(completedTodos.map(todo => todo.id));

    Promise.allSettled(deleteRequests).then(result => {
      const hasError = result.some(item => item.status === 'rejected');
      const successRequest = completedTodos
        .filter((todo, index) => result[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successRequest.includes(todo.id)),
      );

      inputRef.current?.focus();

      if (hasError) {
        setError(ERROR_MESSAGES.delete);
      }

      setProcessingTodosIds([]);
    });
  };

  const handleToggle = async (todoId: number, completed: boolean) => {
    setError('');
    setProcessingTodosIds([todoId]);

    try {
      await updateTodo(todoId, completed);
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed,
            };
          }

          return todo;
        }),
      );
    } catch {
      setError(ERROR_MESSAGES.update);
    } finally {
      setProcessingTodosIds([]);
    }
  };

  const handleAllToggle = (newCompleted: boolean) => {
    const todosToUpdate = todos.filter(todo => todo.completed !== newCompleted);

    const updateRequests = todosToUpdate.map(todo =>
      updateTodo(todo.id, newCompleted),
    );

    setProcessingTodosIds(todosToUpdate.map(todo => todo.id));

    Promise.allSettled(updateRequests).then(result => {
      const hasError = result.some(item => item.status === 'rejected');
      const successRequest = todosToUpdate
        .filter((todo, index) => result[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (successRequest.includes(todo.id)) {
            if (todo.completed !== newCompleted) {
              return {
                ...todo,
                completed: newCompleted,
              };
            }
          }

          return todo;
        }),
      );

      if (hasError) {
        setError(ERROR_MESSAGES.update);
      }

      setProcessingTodosIds([]);
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const handleCancelEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  const handleUpdate = async (todo: Todo) => {
    const normalizedTitle = editTitle.trim();

    if (todo.title === normalizedTitle) {
      setEditingTodoId(null);

      return;
    }

    if (normalizedTitle === '') {
      try {
        await handleDelete(todo.id);
        setEditingTodoId(null);
      } catch {
        setEditingTodoId(todo.id);
      }

      return;
    }

    setProcessingTodosIds([todo.id]);

    try {
      await updateTodoTitle(todo.id, normalizedTitle);
      setTodos(currentTodo =>
        currentTodo.map(currentTodoItem => {
          if (currentTodoItem.id === todo.id) {
            return {
              ...currentTodoItem,
              title: normalizedTitle,
            };
          }

          return currentTodoItem;
        }),
      );
      setEditingTodoId(null);
    } catch {
      setError(ERROR_MESSAGES.update);
    } finally {
      setProcessingTodosIds([]);
    }
  };

  const showTodoList = todos.length > 0 || tempTodo !== null;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loading={loading}
          title={title}
          tempTodo={tempTodo}
          setTitle={setTitle}
          handleAllToggle={handleAllToggle}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
        />

        <Loader isActive={loading} />

        {showTodoList && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            processingTodosIds={processingTodosIds}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleCancelEdit={handleCancelEdit}
            editingTodo={editingTodoId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            handleUpdate={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorText={error} setErrorText={setError} />
    </div>
  );
};
