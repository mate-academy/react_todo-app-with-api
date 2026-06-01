/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter, FilterType } from './components/Filter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const newTodoFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError('');
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setError('Unable to load todos');
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  const focusNewTodoField = () => {
    newTodoFieldRef.current?.focus();
  };

  useEffect(() => {
    if (tempTodo === null) {
      focusNewTodoField();
    }
  }, [tempTodo]);

  const handleErrorHide = () => {
    setError('');
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      focusNewTodoField();

      return;
    }

    if (tempTodo) {
      return;
    }

    setError('');

    const todoToCreate: TodoType = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToCreate);

    try {
      const createdTodo = await createTodo(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleEditStart = (todo: TodoType) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
    setError('');
  };

  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleEditChange = (value: string) => {
    setEditingTitle(value);
  };

  const handleDelete = async (
    id: number,
    options: { keepEditingOpenOnFail?: boolean } = {},
  ) => {
    if (processingIds.includes(id)) {
      return;
    }

    const keepEditingOpenOnFail =
      options.keepEditingOpenOnFail && editingTodoId === id;

    setError('');
    setProcessingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

      if (editingTodoId === id) {
        handleEditCancel();
      }
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      if (!keepEditingOpenOnFail) {
        focusNewTodoField();
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!completedTodoIds.length) {
      return;
    }

    setError('');
    setProcessingIds(prev => [...prev, ...completedTodoIds]);

    const results = await Promise.allSettled(
      completedTodoIds.map(id => deleteTodo(id).then(() => id)),
    );

    const successfulIds = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setError('Unable to delete a todo');
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
    setProcessingIds(prev => prev.filter(id => !completedTodoIds.includes(id)));
    focusNewTodoField();
  };

  const handleUpdate = async (
    id: number,
    data: Partial<Pick<TodoType, 'title' | 'completed'>>,
  ) => {
    if (processingIds.includes(id)) {
      return;
    }

    const todo = todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    setError('');
    setProcessingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos(prevTodos =>
        prevTodos.map(item => (item.id === id ? updatedTodo : item)),
      );

      if ('title' in data && editingTodoId === id) {
        handleEditCancel();
      }
    } catch {
      setError('Unable to update a todo');
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    handleUpdate(id, { completed: !todo.completed });
  };

  const handleToggleAll = async () => {
    if (todos.length === 0) {
      return;
    }

    const shouldCompleteAll = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (!todosToUpdate.length) {
      return;
    }

    setError('');
    setProcessingIds(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    const results = await Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: shouldCompleteAll })
          .then(updated => ({ status: 'fulfilled' as const, todo: updated }))
          .catch(() => ({ status: 'rejected' as const, id: todo.id })),
      ),
    );

    const successfulUpdates = results
      .filter(
        (result): result is { status: 'fulfilled'; todo: TodoType } =>
          result.status === 'fulfilled',
      )
      .map(result => result.todo);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setError('Unable to update a todo');
    }

    setTodos(prevTodos =>
      prevTodos.map(todo => {
        const updated = successfulUpdates.find(item => item.id === todo.id);

        return updated ?? todo;
      }),
    );

    setProcessingIds(prev =>
      prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
    );
  };

  const handleEditSave = async (id: number) => {
    if (editingTodoId !== id) {
      return;
    }

    const todo = todos.find(item => item.id === id);

    if (!todo) {
      handleEditCancel();

      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      handleEditCancel();

      return;
    }

    if (trimmedTitle === '') {
      await handleDelete(id, { keepEditingOpenOnFail: true });

      return;
    }

    await handleUpdate(id, { title: trimmedTitle });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasTempOrTodos = todos.length > 0 || tempTodo !== null;
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTempOrTodos && (
            <button
              type="button"
              className={
                allTodosCompleted
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              onChange={handleNewTodoChange}
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>

        {(hasTempOrTodos || tempTodo) && (
          <TodoList
            todos={todos}
            filter={filter}
            tempTodo={tempTodo}
            processingIds={processingIds}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            onDelete={handleDelete}
            onToggle={handleToggleTodo}
            onEditStart={handleEditStart}
            onEditChange={handleEditChange}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditBlur={handleEditSave}
          />
        )}

        {hasTempOrTodos && todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount === 1
                ? '1 item left'
                : `${activeTodosCount} items left`}
            </span>

            <Filter
              selectedFilter={filter}
              onFilterChange={handleFilterChange}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        message={error}
        isVisible={!!error}
        onHide={handleErrorHide}
      />
    </div>
  );
};
