/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, patchTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Form } from './Form';
import { TodoList } from './TodoList';

export const App: React.FC = () => {
  // todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [todosError, setTodosError] = useState('');
  const [isLoadingIds, setIsLoadingIds] = useState<number[]>([]);

  // add / delete
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // edit
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editTodo, setEditTodo] = useState<null | Todo>(null);
  const [editTitle, setEditTitle] = useState('');

  //onMount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos();

        setTodos(response);
      } catch (err) {
        setTodosError('Unable to load todos');
      } finally {
      }
    };

    fetchTodos();
  }, []);

  //hide error messages after 3s
  useEffect(() => {
    if (!todosError) {
      return;
    }

    const timer = setTimeout(() => {
      setTodosError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [todosError]);

  useEffect(() => {
    if (editTodo !== null) {
      editInputRef.current?.focus();
    }
  }, [editTodo]);

  // visible todos
  const filteredTodos = useMemo(() => {
    if (filter === 'Active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const allCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleSubmit = async (value: string): Promise<boolean> => {
    setTodosError('');

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      setTodosError('Title should not be empty');

      return false;
    }

    try {
      const todo = {
        completed: false,
        userId: USER_ID,
        title: trimmed,
      };

      setTempTodo({ ...todo, id: 0 });
      const response = await addTodo(todo);

      setTodos(prev => [...prev, response]);

      return true;
    } catch (error) {
      setTodosError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      setIsLoadingIds(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setTodosError('Unable to delete a todo');
    } finally {
      setIsLoadingIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsLoadingIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const deletedIds = completedIds.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    if (deletedIds.length !== completedIds.length) {
      setTodosError('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
    setIsLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
    inputRef.current?.focus();
  };

  const handleStatusToggle = async (todo: Todo) => {
    try {
      setIsLoadingIds(prev => [...prev, todo.id]);
      const response = await patchTodo(todo.id, { completed: !todo.completed });

      setTodos(prev =>
        prev.map(item => (item.id === todo.id ? response : item)),
      );
    } catch (error) {
      setTodosError('Unable to update a todo');
    } finally {
      setIsLoadingIds(prev => prev.filter(id => todo.id !== id));
    }
  };

  const handleToggleAll = async () => {
    const todosToToggle = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const ids = todosToToggle.map(todo => todo.id);
    const newStatus = !allCompleted;

    setIsLoadingIds(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(
      todosToToggle.map(todo => patchTodo(todo.id, { completed: newStatus })),
    );

    const updatedIds = ids.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    if (updatedIds.length !== ids.length) {
      setTodosError('Unable to update a todo');
    }

    setTodos(prev =>
      prev.map(todo =>
        updatedIds.includes(todo.id) ? { ...todo, completed: newStatus } : todo,
      ),
    );

    setIsLoadingIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleEditStart = (todo: Todo) => {
    setEditTitle(todo.title);
    setEditTodo(todo);
  };

  const handleEditSave = async (isCancel = false) => {
    const trimmed = editTitle.trim();

    if (trimmed === editTodo?.title || isCancel) {
      setEditTodo(null);

      return;
    }

    if (trimmed.length === 0 && editTodo?.id) {
      await handleDelete(editTodo.id);

      return;
    }

    try {
      if (editTodo?.id) {
        setIsLoadingIds(prev => [...prev, editTodo.id]);
        const response = await patchTodo(editTodo.id, {
          title: trimmed,
        });

        setTodos(prev =>
          prev.map(item => (item.id === editTodo.id ? response : item)),
        );

        setEditTodo(null);
        setEditTitle('');
      }
    } catch (error) {
      setTodosError('Unable to update a todo');
    } finally {
      setIsLoadingIds(prev => prev.filter(id => editTodo?.id !== id));
      inputRef.current?.focus();
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <Form inputRef={inputRef} onSubmitted={handleSubmit} />
        </header>
        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isLoadingIds={isLoadingIds}
              editTodo={editTodo}
              editTitle={editTitle}
              editInputRef={editInputRef}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
              onEditStart={handleEditStart}
              onEditChange={setEditTitle}
              onEditSave={handleEditSave}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={cn('filter__link', { selected: filter === 'All' })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter('All')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={cn('filter__link', {
                    selected: filter === 'Active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter('Active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={cn('filter__link', {
                    selected: filter === 'Completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => {
                    setFilter('Completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={todos.filter(todo => todo.completed).length === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !todosError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodosError('')}
        />
        {todosError}
      </div>
    </div>
  );
};
