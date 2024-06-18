import React, { useEffect, useRef, useState } from 'react';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { LinkMode } from './types/LinkMode';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoFooter } from './components/TodoFilter/TodoFooter';

function getVisibleTodos(todos: Todo[], link: LinkMode) {
  switch (link) {
    case LinkMode.active:
      return todos.filter(todo => !todo.completed);

    case LinkMode.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

function getTodosCount(todos: Todo[]) {
  const all = todos.length;
  const active = todos.reduce(
    (sum, todo) => (todo.completed ? sum : sum + 1),
    0,
  );
  const completed = all - active;

  return { all, active, completed };
}

function getComplitedTodos(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}

function deleteItemFromArray(array: number[], item: number) {
  const rest = [...array];
  const index = rest.indexOf(item);

  rest.splice(index, 1);

  return rest;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosCount = getTodosCount(todos);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeLink, setActiveLink] = useState(LinkMode.all);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const timerId = useRef(0);

  const handleErrorMessage = (errorText: string) => {
    setErrorMessage(errorText);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  const deleteTodo = (id: number) => {
    setDeletingTodoIds(ids => [...ids, id]);

    setErrorMessage('');

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(ids => {
          return deleteItemFromArray(ids, id);
        });

        focusInput();
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsSaving(true);

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    setErrorMessage('');

    return todoService
      .addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
      })
      .catch(() => {
        handleErrorMessage('Unable to add a todo');

        throw new Error();
      })
      .finally(() => {
        setIsSaving(false);
        setTempTodo(null);

        focusInput();
      });
  };

  const updateTodo = (todo: Todo) => {
    setUpdatingTodoIds(ids => [...ids, todo.id]);

    setErrorMessage('');

    return todoService
      .updateTodo({ ...todo })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo => {
            if (prevTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return prevTodo;
          }),
        );
      })
      .catch(() => {
        handleErrorMessage('Unable to update a todo');

        throw new Error();
      })
      .finally(() => {
        setUpdatingTodoIds(ids => {
          return deleteItemFromArray(ids, todo.id);
        });
      });
  };

  const handleToggleAllClick = () => {
    if (
      todosCount.all === todosCount.completed ||
      todosCount.all === todosCount.active
    ) {
      todos.forEach(todo =>
        updateTodo({ ...todo, completed: !todo.completed }),
      );
    } else {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo =>
        updateTodo({ ...todo, completed: !todo.completed }),
      );
    }
  };

  const changeActiveLink = (link: LinkMode) => {
    setActiveLink(link);
  };

  useEffect(() => {
    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage('Unable to load todos'));

    inputRef.current?.focus();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoStatistics={todosCount}
          onToggleClick={handleToggleAllClick}
          inputRef={inputRef}
          isSaving={isSaving}
          addTodo={addTodo}
          handleErrorMessage={handleErrorMessage}
        />

        <TodoList
          visibleTodos={getVisibleTodos(todos, activeLink)}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          tempTodo={tempTodo}
          isSaving={isSaving}
        />

        {todosCount.all > 0 && (
          <TodoFooter
            activeLink={activeLink}
            changeActiveLink={changeActiveLink}
            deleteTodo={deleteTodo}
            getComplitedTodos={getComplitedTodos}
            todos={todos}
            todosCount={todosCount}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseErrorMessage={setErrorMessage}
      />
    </div>
  );
};
