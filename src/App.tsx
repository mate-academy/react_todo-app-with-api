/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteData,
  getTodos,
  updateData,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { NavFilter, Filter } from './components/Filters';
import { FilteredTodos } from './components/FilteredTodos';

type Props = {
  todo: Todo[];
  userId: number;
};

export const App: React.FC<Props> = ({ userId }) => {
  enum ErrorMessage {
    Load = 'Unable to load todos',
    Add = 'Unable to add a todo',
    Delete = 'Unable to delete a todo',
    Update = 'Unable to update a todo',
    TitleEmpty = 'Title should not be empty',
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processing, setProcessing] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  function toggleTodo(todoToUpdate: Todo) {
    return updateData(todoToUpdate)
      .then(todoUpdated => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === todoUpdated.id ? todoUpdated : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => field.current?.focus(), 0);
      });
  }

  const handleToggleAll = () => {
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(t => t.id);

    setProcessing(prev => [...prev, ...idsToUpdate]);
    Promise.all(
      todosToUpdate.map(todo => toggleTodo({ ...todo, completed: newStatus })),
    ).finally(() => {
      setProcessing(prev => prev.filter(id => !idsToUpdate.includes(id)));
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    const tempId = Date.now();

    const newTempTodo: Todo = {
      id: tempId,
      title: title.trim(),
      userId,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(newTempTodo);
    setProcessing(prev => [...prev, tempId]);
    try {
      const newTodo = await createTodo({
        title: title.trim(),
        userId,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
      field.current?.focus();
    } catch {
      setErrorMessage(ErrorMessage.Add);
      setTimeout(() => field.current?.focus(), 0);
    } finally {
      setTempTodo(null);
      setProcessing(prev => prev.filter(id => id !== tempId));
      setIsAdding(false);
      field.current?.focus();
    }
  };

  const deleteTodo = (id: number) => {
    setProcessing([...processing, id]);

    return deleteData(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);

        return Promise.reject();
      })
      .finally(() => {
        setProcessing(prev => prev.filter(todoId => todoId !== id));
        field.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteData(todo.id).then(() => todo.id),
    );

    Promise.allSettled(deletePromises).then(results => {
      const deletedIds = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }

      setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
    });

    field.current?.focus();
  };

  const handleToggle = async (todo: Todo) => {
    setProcessing(prev => [...prev, todo.id]);
    try {
      await toggleTodo(todo);
    } catch (error) {
      setErrorMessage(ErrorMessage.Update);
    } finally {
      setProcessing(prev => prev.filter(id => id !== todo.id));
    }
  };

  const startEditingTodo = (editingTodo: Todo) => {
    setEditingTodoId(editingTodo.id);
    setNewTitle(editingTodo.title);
  };

  const saveEditingTodo = (todo: Todo) => {
    if (newTitle === '') {
      deleteTodo(todo.id)
        .then(() => setEditingTodoId(null))
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);
        });

      return;
    }

    if (newTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setProcessing(prev => [...prev, todo.id]);
    updateData({ ...todo, title: newTitle.trim() })
      .then(() => {
        setEditingTodoId(null);
        setTodos(currentTodos =>
          currentTodos.map(t =>
            t.id === todo.id ? { ...t, title: newTitle.trim() } : t,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => {
        setProcessing(prev => prev.filter(id => id !== todo.id));
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!tempTodo && title === '') {
      field.current?.focus();
    }
  }, [tempTodo, title]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={field}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            <FilteredTodos
              filter={filter}
              todos={todos}
              onDelete={deleteTodo}
              tempTodo={tempTodo}
              processing={processing}
              handleToggle={handleToggle}
              editingTodoId={editingTodoId}
              startEditingTodo={startEditingTodo}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              saveEditingTodo={saveEditingTodo}
              setEditingTodoId={setEditingTodoId}
            />
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos} items left
            </span>
            <NavFilter filter={filter} setFilter={setFilter} />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
