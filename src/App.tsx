/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { NewTodoList } from './components/NewTodoList';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FILTER } from './api/filter';
import { Filter } from './types/Filter';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<Filter>(FILTER.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const isTodosNotEmpty = todos.length > 0;

  const loadingPosts = () => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD_TODO))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadingPosts();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const getVisibleTodos = () => {
    switch (filter) {
      case FILTER.active:
        return todos.filter(todo => !todo.completed);

      case FILTER.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const visibleTodos = getVisibleTodos();

  const handleDelete = (todoId: number) => {
    setIsDeleting(true);
    setDeletingTodoIds(ids => [...ids, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE_TODO);
        throw new Error();
      })
      .finally(() => {
        setIsDeleting(false);
        setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const updateTodo = (todo: Todo, newTodo: Todo) => {
    setUpdatingTodoIds(ids => [...ids, todo.id]);

    return patchTodo(newTodo)
      .then(() => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? newTodo : item)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UPDATE_TODO);
        throw new Error();
      })
      .finally(() => {
        setUpdatingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  const handleChecked = (todo: Todo) => {
    updateTodo(todo, {
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleToggleAll = (posts: Todo[]) => {
    const areAllTodosCompleted = posts.every(t => t.completed);

    if (!areAllTodosCompleted) {
      posts.forEach(t => {
        if (!t.completed) {
          handleChecked(t);
        }
      });
    } else {
      posts.forEach(t => {
        if (t.completed) {
          handleChecked(t);
        }
      });
    }
  };

  const handleHideErrorMessage = () => {
    setErrorMessage('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoList
          todos={todos}
          title={title}
          isLoading={isLoading}
          isDeleting={isDeleting}
          setTitle={setTitle}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
            setErrorMessage={setErrorMessage}
            updateTodo={updateTodo}
            onDelete={handleDelete}
            onChecked={handleChecked}
          />
          {tempTodo && <TodoItem todo={tempTodo} isLoading />}
        </section>

        {isTodosNotEmpty && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={handleHideErrorMessage}
      />
    </div>
  );
};
