import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { USER_ID, todoService } from './api/todos';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

import { Status } from './types/statusTypes';
import { Todo } from './types/Todo';
import { Errors } from './types/errors';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filter, setFilter] = useState(Status.All);
  const [idsProccesing, setIdsProccesing] = useState<number[]>([]);

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOAD));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const getVisibleTodos = () => {
    if (filter === Status.Active) {
      return activeTodos;
    } else if (filter === Status.Completed) {
      return completedTodos;
    } else {
      return todos;
    }
  };

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(Errors.TITLE);

      return;
    }

    if (ref.current) {
      ref.current.disabled = true;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    todoService
      .handleAddTodo(newTodo)
      .then((resTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, resTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADD);
      })
      .finally(() => {
        if (ref.current) {
          ref.current.disabled = false;
        }

        setTempTodo(null);
        ref.current?.focus();
      });
  };

  const onDelete = (todoId: number) => {
    setIdsProccesing(current => [...current, todoId]);

    todoService
      .onDelete(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.DELETE);
      })
      .finally(() => {
        setIdsProccesing(current => current.filter(id => id !== todoId));
        ref.current?.focus();
      });
  };

  const onClear = () => {
    completedTodos.forEach(todo => onDelete(todo.id));
  };

  const onToggle = (todo: Todo) => {
    setIdsProccesing(current => [...current, todo.id]);

    todoService
      .updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => setErrorMessage(Errors.UPDATE))
      .finally(() => {
        setIdsProccesing(current => current.filter(id => id !== todo.id));
      });
  };

  const onRename = (todo: Todo) => {
    setIdsProccesing(current => [...current, todo.id]);

    return todoService
      .updateTodo({ ...todo })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.UPDATE);
        throw new Error();
      });
  };

  const updateAllToggleStatus = () => {
    if (activeTodos.length) {
      activeTodos.forEach(onToggle);
    } else {
      completedTodos.forEach(onToggle);
    }
  };

  const isToggleVisible = !activeTodos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={!!todos.length}
          addTodo={handleAddTodo}
          title={title}
          setTitle={setTitle}
          toggleAll={updateAllToggleStatus}
          isToggleVisible={isToggleVisible}
          inputRef={ref}
        />

        <TodoList
          todos={getVisibleTodos()}
          filter={filter}
          onDelete={onDelete}
          onToggle={onToggle}
          tempTodo={tempTodo}
          idsProccesing={idsProccesing}
          onRename={onRename}
          setIdsProccesing={setIdsProccesing}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodos.length}
            filter={filter}
            setFilter={setFilter}
            onClear={onClear}
            canClearAllVisible={!!completedTodos.length}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
