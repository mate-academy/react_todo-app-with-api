import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

function getFilteredTodos(todos: Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);

    case 'completed':
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [editingTodoIds, setEditingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const filteredTodos = getFilteredTodos(todos, filter);

  {
    useEffect(() => {
      if (!tempTodo && editingTodoIds.length === 0) {
        inputRef.current?.focus();
      }
    }, [tempTodo, editingTodoIds]);
  }

  useEffect(() => {
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (trimmedTitle.length === 0) {
      setError(ErrorMessage.TitleValue);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessage.AddTodo);
      })
      .finally(() => {
        inputRef.current?.focus();
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setEditingTodoIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setEditingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setEditingTodoIds(ids => [...ids, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(todoItem =>
            todoItem.id === updatedTodo.id ? updatedTodo : todoItem,
          ),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setEditingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  const handleRenameTodo = async (todo: Todo, newTitle: string) => {
    setEditingTodoIds(prevIds => [...prevIds, todo.id]);

    return updateTodo({ ...todo, title: newTitle })
      .then(updated => {
        setTodos(prevTodos =>
          prevTodos.map(todoItem =>
            todoItem.id === updated.id ? updated : todoItem,
          ),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);

        return Promise.reject();
      })
      .finally(() =>
        setEditingTodoIds(prevIds =>
          prevIds.filter(editingTodoId => editingTodoId !== todo.id),
        ),
      );
  };

  const handleToggleAllTodos = () => {
    const allTodosCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if (todo.completed === allTodosCompleted) {
        handleToggleTodo(todo);
      }
    });
  };

  const handleClearCompleatedTodos = () => {
    todos
    .filter(todo => todo.completed)
    .forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          tempTodo={tempTodo}
          query={query}
          setQuery={setQuery}
          onSubmit={handleAddTodo}
          inputRef={inputRef}
          onClick={handleToggleAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          editingTodoIds={editingTodoIds}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onRename={handleRenameTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClear={handleClearCompleatedTodos}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClick={() => setError(null)}
      />
    </div>
  );
};
