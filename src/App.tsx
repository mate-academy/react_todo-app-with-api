/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { OurErrors } from './components/OurError';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[] | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(save => setTodos(save))
      .catch(() => {
        setNotificationError('Unable to load todos');
        setTimeout(() => setNotificationError(null), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    const filtered = todos.filter(todo => {
      if (loadingTodoId?.includes(todo.id)) {
        return true;
      }

      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    return tempTodo ? [...filtered, tempTodo] : filtered;
  }, [todos, filter, tempTodo, loadingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const updateTodos = (
    todoId: number,
    updates: Partial<Todo>,
  ): Promise<Todo> => {
    return client.patch(`/todos/${todoId}`, updates);
  };

  const onToggle = (todo: Todo) => {
    const newStatus = !todo.completed;

    setLoadingTodoId(prev => (prev ? [...prev, todo.id] : [todo.id]));
    updateTodos(todo.id, { completed: newStatus })
      .then(() => {
        setTodos(prev =>
          prev.map(t =>
            t.id === todo.id ? { ...t, completed: newStatus } : t,
          ),
        );
        setLoadingTodoId(prev => prev?.filter(id => id !== todo.id) || null);
      })
      .catch(() => {
        setNotificationError('Unable to update a todo');
        setTimeout(() => setNotificationError(null), 3000);
        setLoadingTodoId(prev => prev?.filter(id => id !== todo.id) || null);
      });
  };

  const onToggleAll = () => {
    const newStatus = !(
      todos.length > 0 && todos.every(todo => todo.completed)
    );
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const loadingIds = todosToUpdate.map(todo => todo.id);

    setLoadingTodoId(loadingIds);

    setTodos(prev =>
      prev.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );

    todosToUpdate.forEach(todoToUpdate => {
      updateTodos(todoToUpdate.id, { completed: newStatus })
        .then(() => {
          setTodos(prev =>
            prev.map(t =>
              todosToUpdate.some(x => x.id === t.id)
                ? { ...t, completed: newStatus }
                : t,
            ),
          );
          setLoadingTodoId(prev =>
            prev ? prev.filter(id => id !== todoToUpdate.id) : null,
          );
        })
        .catch(() => {
          setNotificationError('Unable to update a todo');
          setTodos(prev =>
            prev.map(t =>
              t.id === todoToUpdate.id
                ? { ...t, completed: todoToUpdate.completed }
                : t,
            ),
          );
          setLoadingTodoId(prev =>
            prev ? prev.filter(id => id !== todoToUpdate.id) : null,
          );
        });
    });
  };

  const onDelete = (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setNotificationError('Unable to delete a todo');
        setTimeout(() => setNotificationError(null), 3000);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, isDeleting: false } : todo,
          ),
        );
      });
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => onDelete(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          onToggleAll={onToggleAll}
          inputRef={inputRef}
          todos={todos}
          setTodos={setTodos}
          setNotificationError={setNotificationError}
          setTempTodo={setTempTodo}
        />
        <TodoList
          setNotificationError={setNotificationError}
          setLoadingTodoId={setLoadingTodoId}
          updateTodos={updateTodos}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          onToggle={onToggle}
          onDelete={onDelete}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          setTodos={setTodos}
          loadingTodoId={loadingTodoId}
        />
        {todos.length > 0 && (
          <Footer
            onDeleteCompleted={onDeleteCompleted}
            todos={todos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
      <OurErrors
        notificationError={notificationError}
        setNotificationError={setNotificationError}
      />
    </div>
  );
};
