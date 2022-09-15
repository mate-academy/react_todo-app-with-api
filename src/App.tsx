/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  addTodo,
  changeComplete,
  changeTitle,
  getTodos,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItems } from './components/TodoItems';
import { FilterType, Todo } from './types/Todo';

enum ErrorType {
  AddTodo,
  DeleteTodo,
  UpdateTodo,
  Empty,
}

const Error = [
  { type: ErrorType.AddTodo, text: 'Unable to add a todo' },
  { type: ErrorType.DeleteTodo, text: 'Unable to delete a todo' },
  { type: ErrorType.UpdateTodo, text: 'Unable to update a todo' },
  { type: ErrorType.Empty, text: "Title can't be empty" },
];

export const App: React.FC<{}> = () => {
  const user = useContext(AuthContext);
  const todoTitleField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadTodoIds, setLoadTodoIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isToggle, setIsToggle] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res));
    }
  }, []);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [editingValue, todoTitleField]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(null);
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const errorMsg = useCallback((type: ErrorType) => {
    const erObj = Error.find(er => er.type === type);

    if (erObj) {
      setError(erObj.text);
    }

    setTimeout(() => setError(null), 3000);
  }, []);

  const handleSubmit = () => {
    setError(null);
    setIsAdding(false);

    if (query === '') {
      errorMsg(ErrorType.Empty);

      return;
    }

    if (user) {
      const newTodo = {
        title: query,
        userId: user.id,
        completed: false,
      };

      addTodo(newTodo)
        .then(res => {
          setLoadTodoIds(prev => [...prev, res.id]);
          setTodos((prev) => [...prev, res]);
        })
        .catch(() => errorMsg(ErrorType.AddTodo))
        .finally(() => {
          setLoadTodoIds(prev => {
            return prev.slice(0, -1);
          });
          setQuery('');
          setIsAdding(true);
        });
    }
  };

  const deleteTodo = useCallback((id: number) => {
    setLoadTodoIds(prev => [...prev, id]);
    setError(null);

    removeTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => errorMsg(ErrorType.DeleteTodo))
      .finally(() => (
        setLoadTodoIds(prev => prev.filter(todoId => todoId !== id))
      ));
  }, [todos]);

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const handleComplite = useCallback((todoId: number, status: boolean) => {
    setError(null);
    setLoadTodoIds(prev => [...prev, todoId]);
    const newCompleted = !status;

    changeComplete(todoId, { completed: newCompleted })
      .then((res: Todo) => {
        setTodos((prev) => (
          prev.map(item => (item.id === todoId ? res : item))
        ));
      })
      .catch(() => errorMsg(ErrorType.UpdateTodo))
      .finally(() => setLoadTodoIds(
        prev => prev.filter(id => todoId !== id),
      ));
  }, []);

  const toggleAll = useCallback(async () => {
    const toggled = await Promise.all(
      todos.map(todo => {
        if (todo.completed === isToggle) {
          setLoadTodoIds(prev => [...prev, todo.id]);
          handleComplite(todo.id, todo.completed);
        }

        return todo;
      }),
    );

    setTodos(toggled);
    setIsToggle(prev => !prev);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => todo.completed === false);

      case 'completed':
        return todos.filter(todo => todo.completed === true);

      default:
        return [...todos];
    }
  }, [filterType, todos]);

  const onEditing = useCallback((id: number) => {
    setError(null);
    const task = todos.find(todo => todo.id === id);

    if (task?.title === editingValue) {
      setIsEditing(null);
      setLoadTodoIds(
        prev => prev.filter(todoId => todoId !== id),
      );

      return;
    }

    if (editingValue === '') {
      deleteTodo(id);

      return;
    }

    setLoadTodoIds(prev => [...prev, id]);

    changeTitle(id, { title: editingValue })
      .then((res: Todo) => {
        setTodos((prev) => (
          prev.map(item => (item.id === id ? res : item))
        ));
      })
      .catch(() => errorMsg(ErrorType.UpdateTodo))
      .finally(() => {
        setIsEditing(null);
        setLoadTodoIds(
          prev => prev.filter(todoId => todoId !== id),
        );
      });
  }, [todos, editingValue]);

  const completedTodos = useMemo(() => {
    const complited = [...visibleTodos].filter(todo => todo.completed === true);

    return complited;
  }, [isToggle, visibleTodos]);

  const isCompletedAll = useMemo(() => {
    const isComplited = [...visibleTodos]
      .every(todo => todo.completed === true);

    return isComplited;
  }, [isToggle, visibleTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          isAdding={isAdding}
          handleSubmit={handleSubmit}
          toggleAll={toggleAll}
          isCompletedAll={isCompletedAll}
          visibleTodos={visibleTodos}
        />

        <TodoItems
          visibleTodos={visibleTodos}
          handleComplite={handleComplite}
          isEditing={isEditing}
          onEditing={onEditing}
          todoTitleField={todoTitleField}
          editingValue={editingValue}
          setEditingValue={setEditingValue}
          setIsEditing={setIsEditing}
          deleteTodo={deleteTodo}
          loadTodoIds={loadTodoIds}
        />

        <Footer
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          clearCompleted={clearCompleted}
          completedTodos={completedTodos}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
