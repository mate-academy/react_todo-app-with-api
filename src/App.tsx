/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessages } from './types/ErrorMessages';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [updatingTodoId, setUpdatingTodoId] = useState<number[]>([]);

  const showError = (message: ErrorMessages) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.LoadTodos));
  }, []);

  useEffect(() => {
    if (!isLoading && updatingTodoId.length === 0) {
      newTodoFieldRef.current?.focus();
    }
  }, [isLoading, updatingTodoId]);

  const handleFilterChange = (
    event: React.MouseEvent,
    newFilterState: Filter,
  ) => {
    event.preventDefault();

    setSelectedFilter(newFilterState);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    setErrorMessage(ErrorMessages.None);
    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    todoService
      .addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        showError(ErrorMessages.AddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage(ErrorMessages.None);
    setUpdatingTodoId(prev => [...prev, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setUpdatingTodoId(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage(ErrorMessages.None);

    const completedTodos = todos.filter(todo => todo.completed);

    const requests = completedTodos.map(todo =>
      todoService.deleteTodo(todo.id),
    );

    Promise.allSettled(requests).then(results => {
      const hasError = results.some(reject => reject.status === 'rejected');

      setTodos(prev =>
        prev.filter(
          todo =>
            !completedTodos.some(
              completedTodo =>
                completedTodo.id === todo.id &&
                results[
                  completedTodos.findIndex(
                    completed => completed.id === completedTodo.id,
                  )
                ].status === 'fulfilled',
            ),
        ),
      );

      if (hasError) {
        showError(ErrorMessages.DeleteTodo);
      }

      newTodoFieldRef.current?.focus();
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    setErrorMessage(ErrorMessages.None);
    setUpdatingTodoId(prev => [...prev, todo.id]);

    todoService
      .updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessages.UpdateTodo);
      })
      .finally(() => {
        setUpdatingTodoId(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleUpdateTodo = (todo: Todo, title: string) => {
    setErrorMessage(ErrorMessages.None);
    setUpdatingTodoId(prev => [...prev, todo.id]);

    todoService
      .updateTodo(todo.id, { title })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessages.UpdateTodo);
      })
      .finally(() => {
        setUpdatingTodoId(prev => prev.filter(id => id !== todo.id));
      });
  };

  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const allCompleted = useMemo(
    () => hasTodos && todos.every(todo => todo.completed),
    [todos, hasTodos],
  );

  const handleToggleAll = () => {
    setErrorMessage(ErrorMessages.None);

    const shouldCompleteAll = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    todosToUpdate.forEach(handleToggleTodo);
  };

  const filteredTodos = getFilteredTodos(todos, selectedFilter);

  const notCompletedCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          hasTodos={hasTodos}
          allCompleted={allCompleted}
          isLoading={isLoading}
          newTitle={newTitle}
          inputRef={newTodoFieldRef}
          onTitleChange={setNewTitle}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          updatingTodoId={updatingTodoId}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
        />

        {hasTodos && (
          <TodoFooter
            notCompletedCount={notCompletedCount}
            hasCompletedTodos={hasCompletedTodos}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessages.None)}
      />
    </div>
  );
};
