/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { TodoHeader } from './Components/TodoHeader';
import { TodoFooter } from './Components/TodoFooter';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { TodoItem } from './Components/TodoItem';
import { Error } from './Components/Error';
import { TodoErrorType } from './types/TodoErrorType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>(
    TodoFilter.All,
  );
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoError, setTodoError] = useState<TodoErrorType>(TodoErrorType.None);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  const todoTitleRef = useRef<HTMLInputElement>(null);

  const uncompletedTodos = useMemo(
    () => todoList.filter(todo => !todo.completed),
    [todoList],
  );

  const completedTodos = useMemo(
    () => todoList.filter(todo => todo.completed),
    [todoList],
  );

  const isAllTodoCompleted = useMemo(() => {
    return completedTodos.length === todoList.length;
  }, [completedTodos, todoList]);

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case TodoFilter.Active:
        return uncompletedTodos;
      case TodoFilter.Completed:
        return completedTodos;
      default:
        return todoList;
    }
  }, [completedTodos, currentFilter, todoList, uncompletedTodos]);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    if (!title) {
      setTodoError(TodoErrorType.EmptyTitle);

      return false;
    }

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    setIsAddingLoading(true);
    try {
      const createdTodo = await createTodo(title);

      setTodoList(prevTodoList => [...prevTodoList, createdTodo]);

      return true;
    } catch (error) {
      setTodoError(TodoErrorType.UnableToAddTodo);

      return false;
    } finally {
      setTempTodo(null);
      setIsAddingLoading(false);
    }
  };

  const handleUpdateTodo = async (todoToUpdate: Todo): Promise<boolean> => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodoList(prevTodoList =>
        prevTodoList.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );

      return true;
    } catch (error) {
      setTodoError(TodoErrorType.UnableToUpdateTodo);

      return false;
    } finally {
      setLoadingTodoIds(prev =>
        prev.filter(todoId => todoId !== todoToUpdate.id),
      );
    }
  };

  const handleDeleteTodo = async (id: number): Promise<boolean> => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodoList(prevTodoList => prevTodoList.filter(todo => todo.id !== id));
      todoTitleRef.current?.focus();

      return true;
    } catch (error) {
      setTodoError(TodoErrorType.UnableToDeleteTodo);

      return false;
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleAllTodos = () => {
    if (uncompletedTodos.length > 0) {
      uncompletedTodos.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todoList.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: false });
      });
    }
  };

  useEffect(() => {
    const loadTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodoList(todosFromServer);
      } catch (error) {
        setTodoError(TodoErrorType.UnableToLoadTodos);
      }
    };

    loadTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitleRef={todoTitleRef}
          onAddTodo={handleAddTodo}
          onToggleAllTodos={handleToggleAllTodos}
          isLoading={isAddingLoading}
          isAllTodoCompleted={isAllTodoCompleted}
          isTodoListNotEmpty={!!todoList.length}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  onUpdateTodo={handleUpdateTodo}
                  onDeleteTodo={handleDeleteTodo}
                  isLoading={loadingTodoIds.includes(todo.id)}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem
                  todo={tempTodo}
                  onUpdateTodo={handleUpdateTodo}
                  onDeleteTodo={handleDeleteTodo}
                  isLoading={isAddingLoading}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {!!todoList.length && (
          <TodoFooter
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            todosLeft={uncompletedTodos.length}
            completedTodos={completedTodos.length}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error error={todoError} setError={setTodoError} />
    </div>
  );
};
