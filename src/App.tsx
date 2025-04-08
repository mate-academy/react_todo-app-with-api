import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import * as todoService from './api/todos';
import { TodoErrorMessages } from './constants/todoMessages';
import { countActiveTodos, isAlltodosCompleted } from './helpers/todo';
import { Todo } from './types/Todo';
import { FilterParams } from './constants/filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosLoading, setTodosLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TodoErrorMessages>(TodoErrorMessages.NONE)
  const [selectedFilterParam, setSelectedFilterParam] = useState<FilterParams>(
    FilterParams.ALL,
  );
  const [pendingTodoIds, setPendingTodoIds] = useState<Set<number>>(new Set());
  const createTodoInputRef = useRef<HTMLInputElement | null>(null);

  const isAllCompleted = todosLoading ? false : isAlltodosCompleted(todos);

  useEffect(() => {
    const loadTodos = async () => {
      setTodosLoading(true);
      try {
        const todosData = await todoService.getTodos();

        setTodos(todosData);
      } catch {
        setErrorMessage(TodoErrorMessages.UNABLE_TO_LOAD);
      } finally {
        setTodosLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleChangeFilterParam = (filterParam: FilterParams) => {
    setSelectedFilterParam(filterParam);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedFilterParam) {
        case FilterParams.ACTIVE:
          return !todo.completed;
        case FilterParams.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, selectedFilterParam]);

  const deleteTodo = async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      createTodoInputRef.current?.focus();
    } catch (error) {
      setErrorMessage(TodoErrorMessages.UNABLE_TO_DELETE);
      throw error;
    }
  };

  const updateTodo = async (todoToUpdate: Todo) => {
    setPendingTodoIds(prev => new Set(prev).add(todoToUpdate.id));

    try {
      const updatedTodo = await todoService.updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoToUpdate.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setErrorMessage(TodoErrorMessages.UNABLE_TO_UPDATE);
    } finally {
      setPendingTodoIds(prev => {
        const updated = new Set(prev);

        updated.delete(todoToUpdate.id);

        return updated;
      });
    }
  };

  const editTitle = async (todoToUpdate: Todo) => {
    setPendingTodoIds(prev => new Set(prev).add(todoToUpdate.id));

    try {
      const updatedTodo = await todoService.updateTodo(todoToUpdate);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoToUpdate.id ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(TodoErrorMessages.UNABLE_TO_UPDATE);
      throw error;
    } finally {
      setPendingTodoIds(prev => {
        const updated = new Set(prev);

        updated.delete(todoToUpdate.id);

        return updated;
      });
    }
  };

  const toggleAllTodos = async () => {
    const allCompleted = isAlltodosCompleted(todos);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setPendingTodoIds(prev => {
      const newPending = new Set(prev);

      todosToUpdate.forEach(todo => newPending.add(todo.id));

      return newPending;
    });

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );

    const updatePromises = todosToUpdate.map(todo =>
      todoService
        .updateTodo({ ...todo, completed: newStatus })
        .catch(() => setErrorMessage(TodoErrorMessages.UNABLE_TO_UPDATE)),
    );

    await Promise.allSettled(updatePromises);

    setPendingTodoIds(prev => {
      const newPending = new Set(prev);

      todosToUpdate.forEach(todo => newPending.delete(todo.id));

      return newPending;
    });
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const loadingSet = new Set(pendingTodoIds);

    completedTodos.forEach(todo => loadingSet.add(todo.id));
    setPendingTodoIds(new Set(loadingSet));

    const deletePromises = completedTodos.map(todo =>
      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(TodoErrorMessages.UNABLE_TO_DELETE);
        })
        .finally(() => {
          setPendingTodoIds(prev => {
            const updated = new Set(prev);

            updated.delete(todo.id);

            return updated;
          });
        }),
    );

    await Promise.allSettled(deletePromises);

    createTodoInputRef.current?.focus();
  };

  const createTodo = async (todoTitile: string) => {
    if (todoTitile.trim().length === 0) {
      setErrorMessage(TodoErrorMessages.EMPTY_TITLE);

      return;
    }

    const tempId = 0;
    const tempTodoItem: Todo = {
      id: tempId,
      title: todoTitile,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(tempTodoItem);

    try {
      const newTodo = await todoService.createTodo(todoTitile.trim());

      setTodos(current => [...current, newTodo]);
      setTempTodo(null);
    } catch (error) {
      setErrorMessage(TodoErrorMessages.UNABLE_TO_ADD);
      setTempTodo(null);
      throw error;
    }
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage(TodoErrorMessages.NONE);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  const numberOfActiveTodos = countActiveTodos(todos);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAlltodosCompleted={isAllCompleted}
          createTodo={createTodo}
          setTempTodo={setTempTodo}
          inputRef={createTodoInputRef}
          toggleAllTodos={toggleAllTodos}
          todosLoading={todosLoading}
          todosLength={todos.length}
        />
        {!todosLoading && (todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            editTitle={editTitle}
            loadingTodos={pendingTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            countOfActiveTodos={numberOfActiveTodos}
            handleChangeFilterParam={handleChangeFilterParam}
            selectedFilterParam={selectedFilterParam}
            clearCompletedTodos={clearCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
