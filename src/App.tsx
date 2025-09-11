/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

enum ErrorMessages {
  LOAD_TODOS = 'Unable to load todos',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
  UPDATE_TODO = 'Unable to update a todo',
  EMPTY_TITLE = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const newTitleRef = useRef<HTMLInputElement>(null);
  const [pendingTodo, setPendingTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);

  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const remainingItems = todosList.filter(todo => !todo.completed);

  const isAddingTodo = pendingTodo !== null;

  const updateTodo = (id: number, data: Partial<Todo>) => {
    return client.patch<Todo>(`/todos/${id}`, data);
  };

  useEffect(() => {
    newTitleRef.current?.focus();
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();

        setTodosList(todos);
      } catch {
        setErrorMsg(ErrorMessages.LOAD_TODOS);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (editingTodoId !== null) {
      const input = document.querySelector<HTMLInputElement>(
        `[data-cy="TodoTitleField"]`,
      );

      input?.focus();
    }
  }, [editingTodoId]);

  useEffect(() => {
    if (!errorMsg) {
      return;
    }

    const timer = setTimeout(() => setErrorMsg(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMsg]);

  const filterTodos = (todos: Todo[], filter: string) => {
    if (filter === 'Active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  };

  const todosToDisplay = pendingTodo ? [...todosList, pendingTodo] : todosList;
  const visibleTodos = filterTodos(todosToDisplay, currentFilter);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setErrorMsg(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const temp = {
      id: 0,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    setPendingTodo(temp);

    try {
      const addedTodo = await addTodo(temp);

      setTodosList(list => [...list, addedTodo]);
      setNewTitle('');
    } catch {
      setErrorMsg(ErrorMessages.ADD_TODO);
    } finally {
      setPendingTodo(null);
      if (newTitleRef.current) {
        setTimeout(() => {
          newTitleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setDeletingTodoId(id);
      await deleteTodo(id);
      setTodosList(list => list.filter(todo => todo.id !== id));
    } catch {
      setErrorMsg(ErrorMessages.DELETE_TODO);
    } finally {
      setDeletingTodoId(null);
      if (newTitleRef.current) {
        setTimeout(() => {
          newTitleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todosList.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingTodosIds(ids => [...ids, ...completedIds]);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleToggleTodo = async (todo: Todo) => {
    setUpdatingIds(ids => [...ids, todo.id]);

    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodosList(list => list.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setErrorMsg(ErrorMessages.UPDATE_TODO);
    } finally {
      setUpdatingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todosList.every(t => t.completed);
    const toUpdate = todosList.filter(t => t.completed === allCompleted);

    setUpdatingIds(ids => [...ids, ...toUpdate.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        toUpdate.map(todo => updateTodo(todo.id, { completed: !allCompleted })),
      );

      const successful = results
        .map((r, i) => (r.status === 'fulfilled' ? toUpdate[i].id : null))
        .filter(Boolean) as number[];

      if (successful.length > 0) {
        setTodosList(list =>
          list.map(todo =>
            successful.includes(todo.id)
              ? { ...todo, completed: !allCompleted }
              : todo,
          ),
        );
      }

      if (results.some(r => r.status === 'rejected')) {
        setErrorMsg(ErrorMessages.UPDATE_TODO);
      }
    } finally {
      setUpdatingIds(ids =>
        ids.filter(id => !toUpdate.map(t => t.id).includes(id)),
      );
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleEditSubmit = async (todo: Todo) => {
    if (updatingIds.includes(todo.id)) {
      return;
    }

    const trimmed = editingTitle.trim();

    if (trimmed === todo.title) {
      cancelEditing();

      return;
    }

    if (!trimmed) {
      handleDeleteTodo(todo.id);

      return;
    }

    setUpdatingIds(ids => [...ids, todo.id]);

    try {
      const updated = await updateTodo(todo.id, { title: trimmed });

      setTodosList(list => list.map(t => (t.id === todo.id ? updated : t)));
      cancelEditing();
    } catch {
      setErrorMsg(ErrorMessages.UPDATE_TODO);
    } finally {
      setUpdatingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoText={newTitle}
          onNewTodoTextChange={handleTitleChange}
          onAddTodo={handleAddTodo}
          newTitleRef={newTitleRef}
          isAddingTodo={isAddingTodo}
          todosList={todosList}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onEditSubmit={handleEditSubmit}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          deletingTodoId={deletingTodoId}
          deletingTodosIds={deletingTodosIds}
          updatingIds={updatingIds}
        />

        {todosList.length > 0 && (
          <Footer
            remainingCount={remainingItems.length}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            onClearCompleted={handleDeleteCompleted}
            hasCompletedTodos={!todosList.every(todo => !todo.completed)}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMsg },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMsg('')}
        />
        {errorMsg}
      </div>
    </div>
  );
};
