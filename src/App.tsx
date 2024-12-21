/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/api';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { Notification } from './components/Notification/Notification';
import * as todoService from './api/api';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [notification, setNotification] = useState({
    isHidden: true,
    message: '',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string) => {
    setNotification({ isHidden: false, message });
    setTimeout(() => setNotification({ isHidden: true, message: '' }), 3000);
  };

  const filterTodos = useCallback((todos: Todo[], filterBy: Filter): Todo[] => {
    switch (filterBy) {
      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todosFromServer, filter),
    [filterTodos, todosFromServer, filter],
  );

  const activeTodosCount = useMemo(
    () => todosFromServer.filter(todo => !todo.completed).length,
    [todosFromServer],
  );

  const allTodosCompleted = useMemo(
    () => activeTodosCount === 0,
    [activeTodosCount],
  );

  const hasCompletedTodos = useMemo(
    () => todosFromServer.some(todo => todo.completed),
    [todosFromServer],
  );

  const handleAddTodo = (title: string) => {
    setNotification({ isHidden: true, message: '' });

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showNotification('Title should not be empty');

      return Promise.reject('Title is empty');
    }

    setTempTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    return todoService
      .createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodosFromServer(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        showNotification('Unable to add a todo');
        throw new Error(error);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(curr => curr.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showNotification('Unable to delete a todo');
        throw new Error(error);
      })
      .finally(() => {
        setLoadingTodoIds([]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodoIds = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedTodoIds);
    Promise.all(
      completedTodoIds.map(id =>
        todoService
          .deleteTodo(id)
          .then(() => {
            setTodosFromServer(curr => curr.filter(todo => todo.id !== id));
          })
          .catch(error => {
            showNotification('Unable to delete a todo');
            throw new Error(error);
          })
          .finally(() => {
            setLoadingTodoIds([]);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }),
      ),
    );
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setLoadingTodoIds([updatedTodo.id]);

    return todoService
      .updateTodo(updatedTodo)
      .then(receivedTodo => {
        setTodosFromServer(curr =>
          curr.map(todo => (todo.id === receivedTodo.id ? receivedTodo : todo)),
        );
      })
      .catch(error => {
        showNotification('Unable to update a todo');
        throw new Error(error);
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleToggleAllTodoStatus = () => {
    let todosToChange = [];

    if (allTodosCompleted) {
      todosToChange = [...todosFromServer];
    } else {
      todosToChange = todosFromServer.filter(todo => !todo.completed);
    }

    const todoToChangeIds = todosToChange.map(todo => todo.id);

    setLoadingTodoIds(todoToChangeIds);
    Promise.all(
      todosToChange.map(todoToChange => {
        const { id, completed, title, userId } = todoToChange;

        todoService
          .updateTodo({ id, completed: !completed, title, userId })
          .then(receivedTodo => {
            setTodosFromServer(curr =>
              curr.map(todo =>
                todo.id === receivedTodo.id ? receivedTodo : todo,
              ),
            );
          })
          .catch(error => {
            showNotification('Unable to update a todo');
            throw new Error(error);
          })
          .finally(() => {
            setLoadingTodoIds([]);
          });
      }),
    );
  };

  useEffect(() => {
    getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        showNotification('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          hasTodos={!!todosFromServer.length}
          allCompletedTodos={allTodosCompleted}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAllTodoStatus}
        />

        {!!todosFromServer.length && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDeleteTodo={handleDeleteTodo}
            loading={loadingTodoIds}
            onUpdateTodo={handleUpdateTodo}
          />
        )}

        {!!todosFromServer.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            currFilter={filter}
            hasCompletedTodos={hasCompletedTodos}
            onFilter={setFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Notification
        message={notification.message}
        isHidden={notification.isHidden}
        onClose={() => setNotification({ ...notification, isHidden: true })}
      />
    </div>
  );
};
