import React, { useEffect, useState } from 'react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoTemp } from './components/TodoTemp';
import { ErrorNotifications } from './components/Errors';

import { Todo } from './types/Todo';
import { Errors } from './types/ErrorsEnum';
import { Filter } from './types/FilterEnum';
import { handleError } from './handlers/handleError';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [inputChange, setInputChange] = useState('');
  const [focusOnChange, setFocusOnChange] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorNotification, setErrorNotification] = useState<Errors>(
    Errors.DEFAULT,
  );
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(curTodo => curTodo.id !== todoId),
        );

        if (editingTodo) {
          setEditingTodo(null);
        }
      })
      .catch(() => {
        handleError(Errors.DELETING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todoId),
        );
        setFocusOnChange(current => !current);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputChange) {
      handleError(Errors.EMPTY, setErrorNotification);

      return;
    }

    const newTodo = {
      title: inputChange.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setLoadingTodoIds(currentIds => [...currentIds, 0]);

    addTodo(newTodo)
      .then(res => {
        setTodos(currentTodos => [...currentTodos, res]);
        setInputChange('');
      })
      .catch(() => {
        handleError(Errors.ADDING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== 0),
        );
        setTempTodo(null);
        setFocusOnChange(current => !current);
      });
  };

  const toggleTodo = (todoId: number, updates: Partial<Todo>) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    updateTodo(todoId, updates)
      .then(res => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            res.id === currentTodo.id ? res : currentTodo,
          ),
        );
      })
      .catch(() => {
        handleError(Errors.UPDATING, setErrorNotification);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todoId),
        );
        setFocusOnChange(current => !current);
      });
  };

  const handleRenameTodo = (
    todoId: number,
    newTitle: string,
    todoTitle: string,
  ) => {
    if (!newTitle.length) {
      handleDelete(todoId);

      return;
    }

    if (newTitle === todoTitle) {
      setEditingTodo(null);

      return;
    }

    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, title: newTitle } : todo,
      ),
    );

    const updates = {
      title: newTitle.trim(),
    };

    updateTodo(todoId, updates)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setEditingTodo(null);
      })
      .catch(() => {
        handleError(Errors.UPDATING, setErrorNotification);
        setTodos(currentTodos =>
          currentTodos === todos ? currentTodos : todos,
        );
      })
      .finally(() => setLoadingTodoIds(ids => ids.filter(id => id !== todoId)));
  };

  const firstLoad = () => {
    setErrorNotification(Errors.DEFAULT);
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Errors.LOADING, setErrorNotification);
      });
  };

  useEffect(() => {
    firstLoad();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleTodo={toggleTodo}
          handleSubmit={handleSubmit}
          inputChange={inputChange}
          loadingTodoIds={loadingTodoIds}
          focusOnChange={focusOnChange}
          onInputChange={setInputChange}
        />

        {!!todos.length && (
          <TodoList
            todos={todos}
            filter={filter}
            onDelete={handleDelete}
            toggleTodo={toggleTodo}
            loadingTodoIds={loadingTodoIds}
            renameTodo={handleRenameTodo}
            editingTodo={editingTodo}
            setEditingTodo={setEditingTodo}
          />
        )}

        {tempTodo && (
          <TodoTemp loadingTodoIds={loadingTodoIds} tempTodo={tempTodo} />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onDelete={handleDelete}
            onFilterChange={setFilter}
          />
        )}
      </div>

      <ErrorNotifications
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
      />
    </div>
  );
};
