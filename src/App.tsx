import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoError } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState('');

  const mainInput = useRef<HTMLInputElement>(null);

  const showError = (errorMsg: TodoError) => {
    setError(errorMsg);
  };

  const hideError = () => {
    setError('');
  };

  const handleFilterChange = (filterParam: Filter) => {
    setFilterBy(filterParam);
  };

  useEffect(() => {
    setError('');
    const fetchTodos = async () => {
      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch {
        showError(TodoError.LOAD);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    hideError();

    const todo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(todo);

    try {
      const newTodo = await todoService.addTodo(title);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      mainInput.current?.focus();

      return true;
    } catch {
      showError(TodoError.ADD);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setProcessingIds(currentIds => new Set(currentIds).add(todoId));
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      mainInput.current?.focus();
    } catch (deleteError) {
      showError(TodoError.DELETE);
      throw deleteError;
    } finally {
      setProcessingIds(currentIds => {
        const next = new Set(currentIds);

        next.delete(todoId);

        return next;
      });
    }
  };

  const handleToggleTodoStatus = async (
    todoId: number,
    currentTodoStatus: boolean,
  ) => {
    hideError();
    setProcessingIds(currentIds => {
      const next = new Set(currentIds);

      next.add(todoId);

      return next;
    });
    try {
      const updatedStatus = await todoService.toggleTodoStatus(
        todoId,
        currentTodoStatus,
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedStatus : todo)),
      );
    } catch {
      showError(TodoError.UPDATE);
    } finally {
      setProcessingIds(currentIds => {
        const next = new Set(currentIds);

        next.delete(todoId);

        return next;
      });
    }
  };

  const updateTodo = async (todoId: number, title: string) => {
    const trimmedTitle = title.trim();

    const currentTitle =
      selectedTodo?.id === todoId
        ? selectedTodo?.title
        : (todos.find(todo => todo.id === todoId)?.title ?? '');

    if (trimmedTitle === currentTitle) {
      setSelectedTodo(null);

      return;
    }

    if (trimmedTitle === '') {
      try {
        await deleteTodo(todoId);

        setSelectedTodo(null);
      } catch {}

      return;
    }

    hideError();
    setProcessingIds(currentIds => {
      const next = new Set(currentIds);

      next.add(todoId);

      return next;
    });

    try {
      const updated = await todoService.updateTodo(todoId, trimmedTitle);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updated : todo)),
      );
      setSelectedTodo(null);
    } catch {
      showError(TodoError.UPDATE);
    } finally {
      setProcessingIds(currentIds => {
        const next = new Set(currentIds);

        next.delete(todoId);

        return next;
      });
    }
  };

  const clearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completed.map(todo => deleteTodo(todo.id)));
    } catch {}
  };

  const toggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    try {
      await Promise.all(
        todos
          .filter(todo => todo.completed === areAllCompleted)
          .map(todo => handleToggleTodoStatus(todo.id, todo.completed)),
      );
    } catch {
      showError(TodoError.TOOGLE_ALL);
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case Filter.ALL:
          return true;
        case Filter.COMPLETED:
          return todo.completed;
        case Filter.ACTIVE:
          return !todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={mainInput}
          onSubmit={addTodo}
          onError={showError}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          processingIds={processingIds}
          onToggle={handleToggleTodoStatus}
          onDoubleClick={setSelectedTodo}
          selectedTodo={selectedTodo}
          onUpdate={updateTodo}
        />

        {tempTodo && <TodoItem todo={tempTodo} isTempTodo />}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            onFilterChange={handleFilterChange}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMsg={error} onClose={hideError} />
    </div>
  );
};
