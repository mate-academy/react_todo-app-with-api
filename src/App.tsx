/* eslint-disable import/extensions */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { Filter } from './types/Filter';

export function getFilteredTodos(
  currentTodos: Todo[],
  currentFilter: Filter,
): Todo[] {
  switch (currentFilter) {
    case Filter.Active:
      return currentTodos.filter(todo => !todo.completed);
    case Filter.Completed:
      return currentTodos.filter(todo => todo.completed);
    case Filter.All:
    default:
      return currentTodos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [disabled, setDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [value, setValue] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const startEditing = (todoId: number) => {
    setEditingTodoId(todoId);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
  };

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setError('');

    try {
      setDisabled(true);
      const TEMP_TODO: Todo = {
        id: 0,
        title: title.trim(),
        completed: false,
        userId: todoService.USER_ID,
      };

      setTempTodo(TEMP_TODO);
      const newTodo = await todoService.addTodo(title.trim());

      setValue('');

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setDisabled(false);
      setTempTodo(null);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      setUpdatingTodoIds(ids => [...ids, todo.id]);

      const updatedTodo = await todoService.updateCompleted(
        todo.id,
        !todo.completed,
      );

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setDisabled(true);
      setDeletingTodoIds(ids => [...ids, todoId]);
      await todoService.deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
      setDisabled(false);
    }
  };

  const onClearCompleted = async () => {
    setDisabled(true);
    const completedTodos = getFilteredTodos(todos, Filter.Completed);

    setDeletingTodoIds(completedTodos.map(todo => todo.id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, idx) => results[idx].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulIds.includes(todo.id)),
    );

    setDeletingTodoIds([]);

    if (results.some(res => res.status === 'rejected')) {
      setError('Unable to delete a todo');
    }

    setDisabled(false);
  };

  const toggleAll = async () => {
    try {
      const allCompleted = todos.every(todo_ => todo_.completed);
      const targetState = !allCompleted; // false = uncomplete all, true = complete all

      const todosToUpdate = todos.filter(
        todo => todo.completed !== targetState,
      );

      if (!todosToUpdate.length) {
        return;
      }

      const todosToUpdateIds = todosToUpdate.map(todo => todo.id);

      setUpdatingTodoIds(todosToUpdateIds);

      const results = await Promise.allSettled(
        todosToUpdate.map(todo =>
          todoService.updateCompleted(todo.id, targetState),
        ),
      );

      const successfulIds = todosToUpdate
        .filter((_, idx) => results[idx].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: targetState }
            : todo,
        ),
      );

      if (results.some(res => res.status === 'rejected')) {
        setError('Unable to update a todo');
      }
    } catch {
      setError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  // const renameTodo = async (todoId: number, title: string) => {
  //   const trimmedTitle = title.trim();

  //   if (!trimmedTitle) {
  //     deleteTodo(todoId);

  //     return;
  //   }

  //   const currentTodo = todos.find(todo => todo.id === todoId);

  //   if (!currentTodo || currentTodo.title === trimmedTitle) {
  //     return;
  //   }

  //   try {
  //     setUpdatingTodoIds(todoIds => [...todoIds, todoId]);
  //     await todoService.updateTitle(todoId, trimmedTitle);

  //     setTodos(currentTodos =>
  //       currentTodos.map(todo =>
  //         todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
  //       ),
  //     );
  //   } catch {
  //     setError('Unable to update a todo');
  //     setEditingTodoId(todoId);
  //   } finally {
  //     setUpdatingTodoIds(ids => ids.filter(id => id !== todoId));
  //   }
  // };

  const renameTodo = async (todoId: number, title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      try {
        setDeletingTodoIds(ids => [...ids, todoId]);
        await todoService.deleteTodo(todoId);
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
        cancelEditing();
      } catch {
        setError('Unable to delete a todo');
      } finally {
        setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
      }

      return;
    }

    const currentTodo = todos.find(todo => todo.id === todoId);

    if (!currentTodo || currentTodo.title === trimmedTitle) {
      cancelEditing();

      return;
    }

    try {
      setUpdatingTodoIds(todoIds => [...todoIds, todoId]);
      await todoService.updateTitle(todoId, trimmedTitle);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
        ),
      );

      cancelEditing();
    } catch {
      setError('Unable to update a todo');
      throw new Error('Update failed');
    } finally {
      setUpdatingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  };

  // const handleUpdateTodo = (todoId: number, title: string) => {
  //   renameTodo(todoId, title);
  //   cancelEditing();
  // };

  const handleUpdateTodo = async (todoId: number, title: string) => {
    try {
      await renameTodo(todoId, title);
    } catch {
      setError('Unable to update a todo');
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilteredTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAdd={handleAddTodo}
          todos={todos}
          disabled={disabled}
          value={value}
          setValue={setValue}
          toggleAll={toggleAll}
        />
        <TodoList
          todos={visibleTodos}
          toggleTodo={toggleTodo}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          startEditing={startEditing}
          editingTodoId={editingTodoId}
          cancelEditing={cancelEditing}
          updateTodo={handleUpdateTodo}
        />
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={error} onClose={() => setError('')} />
    </div>
  );
};
