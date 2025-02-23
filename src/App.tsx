/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './components/TodoItem';
import { focusInput } from './utils/services';
import { ErrNotification } from './components/ErrNotification';

export const USER_ID = 1414;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTodoList, setActiveTodoIdList] = useState<number[]>([]);
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
      } catch {
        showError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    focusInput(inputRef);
  }, [isSubmitting, activeTodoId]);

  const resetForm = () => {
    setTitle('');
    setTempTodo(null);
    setError('');
  };

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    setError('');
    setTitle(trimmedTitle);

    if (!trimmedTitle) {
      showError('Title should not be empty');
      focusInput(inputRef);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);
    setActiveTodoId(newTempTodo.id);

    try {
      const newTodo = await createTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      resetForm();
    } catch (err) {
      showError('Unable to add a todo');
      throw err;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
      setActiveTodoId(null);
      focusInput(inputRef);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setActiveTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      showError('Unable to delete a todo');
      throw err;
    } finally {
      setActiveTodoId(null);
      focusInput(inputRef);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(
      completedTodoIds.map(async todoId => {
        try {
          await deleteTodo(todoId);
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        } catch {
          showError('Unable to delete a todo');
        } finally {
          setActiveTodoId(null);
          focusInput(inputRef);
        }
      }),
    );
  };

  const handleToggle = async (todo: Todo) => {
    setError('');
    setActiveTodoId(todo.id);
    const updatedtodo = { ...todo, completed: !todo.completed };
    const { id, title, completed, userId } = updatedtodo;

    try {
      const updated = await updateTodo({ id, title, completed, userId });

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      setActiveTodoId(null);
    }
  };

  const handleToggleAll = async () => {
    let toggledList = todos.filter(todo => !todo.completed);

    if (isAllCompleted) {
      toggledList = [...todos];
    }

    const shouldCompleteAll = !isAllCompleted;
    const activeTodoIds = toggledList.map(todo => todo.id);

    setActiveTodoIdList(activeTodoIds);

    await Promise.allSettled(
      toggledList.map(async todo => {
        const updatedTodo = {
          ...todo,
          completed: shouldCompleteAll,
        };
        const { id, title, completed, userId } = updatedTodo;

        try {
          const updated = await updateTodo({ id, title, completed, userId });

          setTodos(currentTodos =>
            currentTodos.map(t => (t.id === updated.id ? updated : t)),
          );
        } catch {
          showError(`Unable to update todo with ID ${todo.id}`);
        }
      }),
    );

    setActiveTodoIdList([]);
  };

  const handleUpdateTodo = async (todo: Todo, newTitle: string) => {
    setActiveTodoId(todo.id);

    try {
      const updatedTodo = await updateTodo({
        id: todo.id,
        title: newTitle,
        completed: todo.completed,
        userId: USER_ID,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (err) {
      showError('Unable to update a todo');
      throw err;
    } finally {
      setActiveTodoId(null);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosLen={todos.length}
          onSubmit={handleSubmit}
          onReset={resetForm}
          isAllCompleted={isAllCompleted}
          title={title}
          onTitleChange={handleTitleChange}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          onClick={handleToggleAll}
        />
        {!isLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TransitionGroup>
                {filteredTodos.map(todo => (
                  <CSSTransition key={todo.id} timeout={300} classNames="item">
                    <TodoItem
                      todo={todo}
                      key={todo.id}
                      onDelete={handleDeleteTodo}
                      activeTodoId={activeTodoId}
                      onChange={handleToggle}
                      onUpdate={handleUpdateTodo}
                      inputRef={inputRef}
                      activeTodoList={activeTodoList}
                    />
                  </CSSTransition>
                ))}
                {tempTodo && (
                  <CSSTransition key={0} timeout={300} classNames="temp-item">
                    <TodoItem
                      todo={tempTodo}
                      key={tempTodo.id}
                      onDelete={handleDeleteTodo}
                      activeTodoId={activeTodoId}
                      onChange={handleToggle}
                      onUpdate={handleUpdateTodo}
                      inputRef={inputRef}
                      activeTodoList={activeTodoList}
                    />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                onFilterChange={handleFilterChange}
                hasCompleted={hasCompleted}
                onClick={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>
      <ErrNotification err={error} onClick={setError} />
    </div>
  );
};
