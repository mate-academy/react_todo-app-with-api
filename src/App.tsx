import React, { useEffect, useMemo, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Filter } from './FilterEnum';
import { filterTodos } from './utils/todo/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationHidden, setIsNotificationHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsNotificationHidden(false);

    setTimeout(() => {
      setErrorMessage('');
      setIsNotificationHidden(true);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, []);

  const hasTodos = !!todos.length;

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const areAllTodosCompleted = useMemo(
    () => activeTodosCount === 0,
    [activeTodosCount],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const handleAddTodo = (title: string) => {
    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showErrorMessage('Title should not be empty');

      return Promise.reject('Title is empty');
    }

    setTempTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    return addTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        showErrorMessage('Unable to add a todo');
        throw new Error(error);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(curr => curr.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showErrorMessage('Unable to delete a todo');
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
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedTodoIds);
    Promise.all(
      completedTodoIds.map(id =>
        deleteTodo(id)
          .then(() => {
            setTodos(curr => curr.filter(todo => todo.id !== id));
          })
          .catch(error => {
            showErrorMessage('Unable to delete a todo');
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

    return updateTodo(updatedTodo)
      .then(receivedTodo => {
        setTodos(curr =>
          curr.map(todo => (todo.id === receivedTodo.id ? receivedTodo : todo)),
        );
      })
      .catch(error => {
        showErrorMessage('Unable to update a todo');
        throw new Error(error);
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleToggleAllTodoSattus = () => {
    let todosToChange = [];

    if (areAllTodosCompleted) {
      todosToChange = [...todos];
    } else {
      todosToChange = todos.filter(todo => !todo.completed);
    }

    const todoToChangeIds = todosToChange.map(todo => todo.id);

    setLoadingTodoIds(todoToChangeIds);
    Promise.all(
      todosToChange.map(todoToChange => {
        const { id, completed, title, userId } = todoToChange;

        updateTodo({ id, completed: !completed, title, userId })
          .then(receivedTodo => {
            setTodos(curr =>
              curr.map(todo =>
                todo.id === receivedTodo.id ? receivedTodo : todo,
              ),
            );
          })
          .catch(error => {
            showErrorMessage('Unable to update a todo');
            throw new Error(error);
          })
          .finally(() => {
            setLoadingTodoIds([]);
          });
      }),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllTodosCompleted={areAllTodosCompleted}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          hasTodos={hasTodos}
          onToggleAll={handleToggleAllTodoSattus}
        />

        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {hasTodos && (
          <Footer
            currFilter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterClick={setFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        isHidden={isNotificationHidden}
        onClose={setIsNotificationHidden}
      />
    </div>
  );
};
