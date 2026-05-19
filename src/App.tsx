/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './Types/Todo';
import { TodoFooter } from './Components/Footer/TodoFooter';
import { TodoItem } from './Components/TodoItem/TodoItem';
import { ErrorNotification } from './Components/Errors/ErrorNotification';
import { ErrorType, FilterStatus } from './Types/Types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorType | ''>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [newTodoTask, setNewTodoTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  function loadTodos() {
    setLoading(true);

    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.Load))
      .finally(() => setLoading(false));
  }

  useEffect(loadTodos, []);

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTask(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimSpacesTitle = newTodoTask.trim();

    if (!trimSpacesTitle) {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimSpacesTitle,
      userId: postService.USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    postService
      .createTodo({
        title: trimSpacesTitle,
        userId: postService.USER_ID,
        completed: false,
      })

      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
        setNewTodoTask('');
      })
      .catch(() => setErrorMessage(ErrorType.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && !loading && isProcessing.length === 0) {
      const timeoutId = setTimeout(() => {
        field.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [isSubmitting, loading, isProcessing]);

  async function deleteItem(todoId: number) {
    setLoading(true);
    setIsProcessing(current => [...current, todoId]);
    try {
      await postService.deleteTodo(todoId);

      setTodos(currentItem => currentItem.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.Delete);
      throw error;
    } finally {
      setIsProcessing(current => current.filter(id => id !== todoId));
      setLoading(false);
    }
  }

  const clearCompleted = () => {
    const completedIds = todos.filter(todo => todo.completed);

    const deletePromises = completedIds.map(todo => {
      return deleteItem(todo.id);
    });

    Promise.all(deletePromises)
      .then(() => {
        setTodos(prev => prev.filter(t => !t.completed));
      })
      .catch(() => setErrorMessage(ErrorType.Delete));
  };

  async function handleUpdate(todoId: number, data: Partial<Todo>) {
    setIsProcessing(current => [...current, todoId]);
    try {
      try {
        const updatedTodo = await postService.updateTodo(todoId, data);

        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      } catch (error) {
        setErrorMessage(ErrorType.Update);
        throw error;
      }
    } finally {
      setIsProcessing(current_1 => current_1.filter(id => id !== todoId));
    }
  }

  const toggleAll = () => {
    const shouldCompleteAll = !isAllCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    const updatedTodos = todosToUpdate.map(todo => {
      return handleUpdate(todo.id, { completed: shouldCompleteAll });
    });

    Promise.all(updatedTodos).catch(() => {
      setErrorMessage(ErrorType.Update);
    });
  };

  if (!postService.USER_ID) {
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
              className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              ref={field}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTask}
              onChange={handleTaskChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={deleteItem}
                  isLoading={isProcessing.includes(todo.id)}
                  updateTodo={handleUpdate}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem
                  todo={tempTodo}
                  onDelete={() => {}}
                  isLoading={true}
                  updateTodo={() => Promise.resolve()}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filterStatus={filterStatus}
            hasCompleted={hasCompleted}
            onFilterChange={setFilterStatus}
            onClearCompleted={clearCompleted}
          />
        )}

        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      </div>
    </div>
  );
};
