import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodos,
  deleteTodos,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { getFilteredTodos } from './utils/getFilterTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { wait } from './utils/fetchClient';
import { Error } from './components/Error';
import { countIncompleteItems } from './utils/countIncompleteItems';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const titleField = useRef<HTMLInputElement>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    wait(3000).then(() => {
      setErrorMessage('');
    });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(`Unable to load todos`);
      });
  }, [errorMessage]);

  useEffect(() => {
    if (!tempTodo) {
      titleField.current?.focus();
    }
  }, [tempTodo]);

  const deleteTodo = (id: number) => {
    setErrorMessage('');
    setLoadingIds(prevIds => [...prevIds, id]);

    return deleteTodos(id)
      .then(() => setTodos(todo => todo.filter(todoItem => todoItem.id !== id)))
      .catch(() => {
        handleError(`Unable to delete a todo`);
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(prevId => prevId !== id));
        titleField.current?.focus();
      });
  };

  const visibleTodos = getFilteredTodos([...todos], filter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = todoTitle.trim();

    if (!normalizedTitle) {
      handleError(`Title should not be empty`);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle.trim(),
      completed: false,
      userId: 0,
    });

    setErrorMessage('');

    createTodos(normalizedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        handleError(`Unable to add a todo`);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setErrorMessage('');
    setLoadingIds(prevIds => [...prevIds, todoToUpdate.id]);

    updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoToUpdate.id
              ? { ...todo, completed: !todo.completed }
              : todo,
          ),
        );
      })
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todoToUpdate.id));
      });
  };

  const toggleAllTodos = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleTodo(todo));
    } else {
      completedTodos.forEach(todo => toggleTodo(todo));
    }
  };

  const renameTodo = (todoRename: Todo, newTitle: string) => {
    setErrorMessage('');
    setLoadingIds(prevIds => [...prevIds, todoRename.id]);

    return updateTodo({
      ...todoRename,
      title: newTitle,
    })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoRename.id ? { ...todo, title: newTitle } : todo,
          ),
        );
      })
      .catch(error => {
        handleError('Unable to update a todo');

        throw error;
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todoRename.id));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              onClick={toggleAllTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleField}
              value={todoTitle}
              onChange={e => setTodoTitle(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          toggleTodo={toggleTodo}
          onRename={renameTodo}
        />

        {!!todos.length && (
          <Footer
            todos={visibleTodos}
            itemsLeft={countIncompleteItems(todos)}
            filter={filter}
            setFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
