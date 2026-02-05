/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createNewTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/filterType';
import { ErrorMessages } from './types/Errors';
import { Notification } from './components/ErrorNotification';

const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      case FilterType.All:
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const inputField = useRef<HTMLInputElement | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [filter, setFilter] = useState(FilterType.All);

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingId, setProcessingId] = useState<number[]>([]);

  const hasTodos = todos.length > 0;

  useEffect(() => {
    setError(null);
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LoadTodos);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTimer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(errorTimer);
  }, [error]);

  useEffect(() => {
    if (!loading) {
      inputField.current?.focus();
    }
  }, [loading]);

  const filteredTodos = filterTodos(todos, filter);

  const allTodosIsComplited =
    todos.every(todo => todo.completed) && todos.length > 0;

  const todoIsComplited = todos.some(todo => todo.completed);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleCreateTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessages.EmptyTitle);
      inputField.current?.focus();

      return;
    }

    setLoading(true);

    const tempTodoElement: Todo = {
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(tempTodoElement);

    createNewTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessages.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    setProcessingId(prevId => [...prevId, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todoMatch =>
            todoMatch.id === todo.id ? updatedTodo : todoMatch,
          ),
        );
      })
      .catch(err => {
        setError(ErrorMessages.ToUpdate);
        throw err;
      })
      .finally(() => {
        setProcessingId(ids => ids.filter(id => id !== todo.id));
      });
  };

  const handleToggleTodo = (id: number) => {
    const todoToToggle = todos.find(todo => todo.id === id);

    if (todoToToggle) {
      handleUpdateTodo({ ...todoToToggle, completed: !todoToToggle.completed });
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setLoading(true);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: shouldComplete }),
      ),
    );

    const hasError = results.some(result => result.status === 'rejected');

    if (hasError) {
      setError(ErrorMessages.ToUpdateSome);
      setLoading(false);

      return;
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.completed !== shouldComplete
          ? { ...todo, completed: shouldComplete }
          : todo,
      ),
    );

    setLoading(false);
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingId(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        inputField.current?.focus();
      })
      .catch(() => setError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setProcessingId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleRemoveAllCompleted = () => {
    todos
      .filter(item => item.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodo={allTodosIsComplited}
          title={title}
          setTitle={setTitle}
          inputField={inputField}
          loading={loading}
          onTodoAdd={handleCreateTodo}
          toggleAll={handleToggleAll}
          hasTodos={hasTodos}
        />
        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onUpdate={handleUpdateTodo}
            processingIds={processingId}
          />
        )}

        {hasTodos && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todoIsComplited={todoIsComplited}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleRemoveAllCompleted}
          />
        )}
      </div>

      <Notification error={error} onClose={() => setError(null)} />
    </div>
  );
};
