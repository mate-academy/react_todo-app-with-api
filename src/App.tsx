/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodos,
  deleteTodos,
  getTodos,
  todosServiceErrorText,
  updateTodo,
  USER_ID,
} from './api/todos';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { Filter, FilterStatus } from './components/Filter';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const shouldShowUserWarning = !USER_ID;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const focusedInput = useRef<HTMLInputElement>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processingIds, setProcessingIds] = useState<Todo['id'][]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(todosServiceErrorText.Unable_to_load_todos);
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (!isLoading && !isCreating && focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [isLoading, isCreating]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setErrorMessage(todosServiceErrorText.title_should_not_be_empty);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      focusedInput.current?.focus();

      return;
    }

    setErrorMessage(null);
    setIsCreating(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodos(title);

      setTodos(prev => [...prev, created]);
      setTodoTitle('');
    } catch {
      setErrorMessage(todosServiceErrorText.Unable_to_add_a_todo);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setTempTodo(null);
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await deleteTodos(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(todosServiceErrorText.Unable_to_delete_a_todo);
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));
      focusedInput.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      setProcessingIds(prev => [
        ...prev,
        ...completedTodos.map(todo => todo.id),
      ]);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      const hasErrors = results.some(result => result.status === 'rejected');

      if (hasErrors) {
        setErrorMessage(todosServiceErrorText.Unable_to_delete_a_todo);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } finally {
      setProcessingIds(prev =>
        prev.filter(
          id => !todos.some(todo => todo.completed && todo.id === id),
        ),
      );

      focusedInput.current?.focus();
    }
  };

  const handleToggleTodo = async (id: Todo['id'], completed: boolean) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, { completed });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo,
        ),
      );
    } catch {
      setErrorMessage(todosServiceErrorText.Unable_to_update_a_todo);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setProcessingIds(prev =>
        prev.filter(processingId => processingId !== id),
      );
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...idsToUpdate]);

    try {
      const results = await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newStatus }),
        ),
      );

      const successfulIds = results
        .map((result, i) =>
          result.status === 'fulfilled' ? todosToUpdate[i].id : null,
        )
        .filter(id => id !== null);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: newStatus }
            : todo,
        ),
      );

      const hasFailed = results.some(r => r.status === 'rejected');

      if (hasFailed) {
        setErrorMessage(todosServiceErrorText.Unable_to_update_a_todo);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } catch {
      setErrorMessage(todosServiceErrorText.Unable_to_update_a_todo);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const handleEditTodo = async (id: Todo['id'], newTitle: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      const updatedTodo = await updateTodo(id, { title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(todosServiceErrorText.Unable_to_update_a_todo);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(prevId => prevId !== id));
    }
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const hasTodos = todos.length > 0;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  if (shouldShowUserWarning) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: allCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            isLoading={isLoading || isCreating}
            focusedInput={focusedInput}
            todoTitle={todoTitle}
            onTitleChange={setTodoTitle}
            onCreateTodo={handleAddTodo}
          />
        </header>

        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            isLoading={isLoading}
            processingIds={processingIds}
            onDeleteTodo={handleDeleteTodo}
            isCreating={isCreating}
            tempTodo={tempTodo}
            onToggleTodo={handleToggleTodo}
            onEditTodo={handleEditTodo}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
            </span>

            <Filter value={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
