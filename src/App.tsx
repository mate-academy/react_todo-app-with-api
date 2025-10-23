import { useEffect, useState, useRef, useMemo } from 'react';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import Error from './components/Error/Error';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { ErrorMessage } from './constants/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';
import classNames from 'classnames';

type TimeoutRefType = ReturnType<typeof setTimeout> | null;

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.EMPTY);
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const timeoutRef = useRef<TimeoutRefType>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const showError = (message: ErrorMessage) => {
    setError(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setError(ErrorMessage.EMPTY);
      timeoutRef.current = null;
    }, 3000);
  };

  const clearError = () => {
    setError(ErrorMessage.EMPTY);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const addLoadingId = (id: number) => {
    setLoadingTodoIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeLoadingId = (id: number) => {
    setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
  };

  const performTodoAction = async (
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: () => Promise<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    successHandler: (result: any) => void,
    errorMessage: ErrorMessage,
  ) => {
    if (id !== 0 && loadingTodoIds.includes(id)) {
      return;
    }

    addLoadingId(id);
    clearError();

    try {
      const result = await action();

      successHandler(result);
    } catch {
      showError(errorMessage);
    } finally {
      removeLoadingId(id);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const todosFromServer = await todoService.getTodos();

        setTodos(todosFromServer);
      } catch {
        showError(ErrorMessage.LOAD);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAddTodo = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EMPTY_TITLE);

      return false;
    }

    clearError();
    setIsInputDisabled(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await todoService.addTodo({
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch {
      showError(ErrorMessage.ADD);

      return false;
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleToggleAll = async () => {
    if (loadingTodoIds.length > 0) {
      return;
    }

    const willBeCompleted = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== willBeCompleted,
    );
    const currentTodoIds = todosToUpdate.map(todo => todo.id);

    if (currentTodoIds.length === 0) {
      return;
    }

    clearError();
    setLoadingTodoIds(prev => [
      ...prev,
      ...currentTodoIds.filter(id => !prev.includes(id)),
    ]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        todoService.updateTodo(todo.id, {
          completed: willBeCompleted,
        }),
      ),
    );

    const updatedTodos = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<Todo>).value);

    setTodos(prev =>
      prev.map(todo => {
        const updated = updatedTodos.find(t => t.id === todo.id);

        return updated || todo;
      }),
    );

    if (updatedTodos.length !== todosToUpdate.length) {
      showError(ErrorMessage.UPDATE);
    }

    setLoadingTodoIds(prev => prev.filter(id => !currentTodoIds.includes(id)));
  };

  const handleToggle = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const action = () =>
      todoService.updateTodo(id, { completed: !todoToUpdate.completed });

    const successHandler = (newTodo: Todo) => {
      setTodos(current =>
        current.map(todo => (todo.id === id ? newTodo : todo)),
      );
    };

    await performTodoAction(id, action, successHandler, ErrorMessage.UPDATE);
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    const todoToDelete = todos.find(todo => todo.id === id);

    if (!todoToDelete) {
      return false;
    }

    let success = false;

    addLoadingId(id);
    clearError();

    try {
      await todoService.deleteTodo(id);

      setTodos(current => current.filter(todo => todo.id !== id));

      if (inputRef.current && !isInputDisabled) {
        inputRef.current.focus();
      }

      success = true;
    } catch {
      showError(ErrorMessage.DELETE);
      success = false;
    } finally {
      removeLoadingId(id);
    }

    return success;
  };

  const handleUpdate = async (
    id: number,
    newTitle: string,
  ): Promise<boolean> => {
    const trimmed = newTitle.trim();
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return false;
    }

    if (!trimmed) {
      return handleDelete(id);
    }

    if (todoToUpdate.title === trimmed) {
      return true;
    }

    let success = false;

    addLoadingId(id);
    clearError();

    try {
      const newTodo = await todoService.updateTodo(id, { title: trimmed });

      setTodos(current =>
        current.map(todo => (todo.id === id ? newTodo : todo)),
      );
      success = true;
    } catch {
      showError(ErrorMessage.UPDATE);
      success = false;
    } finally {
      removeLoadingId(id);
    }

    return success;
  };

  const handleClearCompleted = async () => {
    if (loadingTodoIds.length > 0) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    clearError();
    setLoadingTodoIds(prev => [
      ...prev,
      ...completedIds.filter(id => !prev.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    const successfulDeletesIds: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulDeletesIds.push(completedIds[index]);
      }
    });

    setTodos(prev =>
      prev.filter(todo => !successfulDeletesIds.includes(todo.id)),
    );

    if (successfulDeletesIds.length !== completedTodos.length) {
      showError(ErrorMessage.DELETE);
    } else {
      if (inputRef.current && !isInputDisabled) {
        inputRef.current.focus();
      }
    }

    setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterTypes.Active:
          return !todo.completed;
        case FilterTypes.Completed:
          return todo.completed;
        case FilterTypes.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  useEffect(() => {
    if (!tempTodo && inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [tempTodo, isInputDisabled]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          allCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          hasTodos={todos.length > 0}
        />
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
        <TodoList
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            completed={tempTodo.completed}
            title={tempTodo.title}
            id={tempTodo.id}
            loading={true}
            onToggle={() => {}}
            onDelete={() => Promise.resolve(false)}
            onUpdate={() => Promise.resolve(false)}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeTodos={activeTodosCount}
            filter={filter}
            setFilterBy={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <Error errorMessage={error} hideError={clearError} />
    </div>
  );
};
