/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter, FilterType } from './components/Filter';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<TodoType | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getAllTodos = async () => {
    try {
      const allTodos = await getTodos();

      setTodos(allTodos);
    } catch {
      setErrorMessage('Unable to load todos');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    }
  };

  const addNewTodo = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);

      return;
    }

    setAddingTodo(true);
    setTempTodo({
      id: 0,
      completed: false,
      title: trimmedTitle,
      userId: USER_ID,
    });
    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        completed: false,
        title: trimmedTitle,
      });

      if (newTodo) {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      }
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setAddingTodo(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setCurrentTodo(null);
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ success: true, id: todo.id }))
        .catch(() => ({ success: false, id: todo.id })),
    );

    const results = await Promise.all(deletePromises);

    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    const failedIds = results
      .filter(result => !result.success)
      .map(result => result.id);

    if (successfulIds.length > 0) {
      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (failedIds.length > 0) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    }

    setDeletingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
    inputRef.current?.focus();
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    if (!addingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingTodo]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addNewTodo();
  };

  const filterTodos = (type: FilterType) => {
    switch (type) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleToggleTodo = async (todo: TodoType) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);
    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;
    const changedTodos = todos.filter(todo => todo.completed !== targetStatus);
    const changedIds = changedTodos.map(todo => todo.id);

    if (changedTodos.length === 0) {
      return;
    }

    setUpdatingTodoIds(prev => [...prev, ...changedIds]);

    try {
      const promises = changedTodos.map(todo =>
        updateTodo(todo.id, { completed: targetStatus }),
      );

      await Promise.all(promises);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          changedIds.includes(todo.id)
            ? { ...todo, completed: targetStatus }
            : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => !changedIds.includes(id)));
    }
  };

  const handleRename = async (todo: TodoType, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setCurrentTodo(null);

      return;
    }

    if (!trimmedTitle) {
      await handleDeleteTodo(todo.id);

      return;
    }

    setUpdatingTodoIds(prev => [...prev, todo.id]);
    try {
      const updatedTodo = await updateTodo(todo.id, { title: trimmedTitle });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
      setCurrentTodo(null);
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3_000);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(filterType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              title="toggle all todos"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodos}
            />
          )}

          <NewTodo
            ref={inputRef}
            title={title}
            onChangeTitle={setTitle}
            onSubmit={onSubmit}
            disabled={addingTodo}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
            currentTodo={currentTodo}
            tempTodo={tempTodo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onRename={handleRename}
            onStartEdit={setCurrentTodo}
            onCancelEdit={() => setCurrentTodo(null)}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            <Filter filterType={filterType} onChangeFilter={setFilterType} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          `notification is-danger is-light has-text-weight-normal`,
          { hidden: !errorMessage },
        )}
      >
        <button
          title="delete button"
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
