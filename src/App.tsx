/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterOptions } from './components/Filter';
import { TodoCard } from './components/Todo';

export enum Status {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const errorMaker = (errorText: string) => {
    setErrorMessage(errorText);
    inputRef.current?.focus();
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const addNewTodo = async (text: string) => {
    const trimmedTitle = text.trim();

    if (!trimmedTitle) {
      errorMaker('Title should not be empty');

      return;
    }

    setErrorMessage(null);

    const todoToAdd: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToAdd);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch {
      errorMaker('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const onDelete = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    } catch {
      errorMaker('Unable to delete a todo');
      throw new Error();
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
      inputRef.current?.focus();
    }
  };

  const onToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setProcessingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await patchTodo(id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      errorMaker('Unable to update a todo');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    setProcessingIds(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          patchTodo(todo.id, {
            completed: !allCompleted,
          }),
        ),
      );

      setTodos(prev =>
        prev.map(
          todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
        ),
      );
    } catch {
      errorMaker('Unable to update a todo');
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const onUpdate = async (id: number, newTitle: string) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await patchTodo(id, {
        title: newTitle,
      });

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch {
      errorMaker('Unable to update a todo');
      throw new Error();
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
  };

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    getTodos()
      .then(items => {
        setTodos(items);
        inputRef.current?.focus();
      })
      .catch(() => {
        errorMaker('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hideError = () => setErrorMessage(null);
  const activeTodosCount = todos.filter(item => !item.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => toggleAll()}
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();
              addNewTodo(title);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              ref={inputRef}
              onChange={e => setTitle(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                todos={filteredTodos}
                onDelete={onDelete}
                processingIds={processingIds}
                onToggle={onToggle}
                setEditingTodoId={setEditingTodoId}
                editingTodoId={editingTodoId}
                onUpdate={onUpdate}
              />
              {tempTodo && (
                <TodoCard
                  todo={tempTodo}
                  onDelete={onDelete}
                  isProcessed
                  onToggle={onToggle}
                  setEditingTodoId={setEditingTodoId}
                  editingTodoId={editingTodoId}
                  onUpdate={onUpdate}
                />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <FilterOptions changeOption={setFilter} />
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(t => t.completed)}
                onClick={() => clearCompleted()}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        {errorMessage}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
      </div>
    </div>
  );
};
