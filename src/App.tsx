import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { Status } from './types/Status';
import { filterTodos } from './components/TodoFilter/filterTodos';
import { TodoFilter } from './components/TodoFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMsg, setErrorMsg] = useState<ErrorType>(ErrorType.Default);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const addInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allAreCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );
  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const handleError = useCallback((error: ErrorType) => {
    setErrorMsg(error);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setErrorMsg(ErrorType.Default);
      timeoutRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onTodoAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError(ErrorType.EmptyTitle);

      return;
    }

    const trimmedTitle = newTodoTitle.trim();

    setTempTodo({
      title: trimmedTitle,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
    } catch {
      handleError(ErrorType.AddTodoFailed);
    } finally {
      setTempTodo(null);
    }
  };

  const onTodoDelete = async (todoId: number): Promise<void> => {
    setProcessingTodos(prevProcessing => [...prevProcessing, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(prevTodo => prevTodo.id !== todoId));
    } catch {
      handleError(ErrorType.DeleteTodoFailed);
    } finally {
      setProcessingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const onTodoEdit = async (
    todoId: number,
    updatedFields: Partial<Todo>,
  ): Promise<void> => {
    setProcessingTodos(prev => [...prev, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, updatedFields);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      handleError(ErrorType.UpdateTodoFailed);
    } finally {
      setProcessingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const onToggleCompletedAll = () => {
    const todosToToggle = allAreCompleted
      ? [...todos]
      : todos.filter(todo => !todo.completed);

    todosToToggle.forEach(todo =>
      onTodoEdit(todo.id, { completed: !todo.completed }),
    );
  };

  const onDeleteCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => onTodoDelete(todo.id)));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorType.LoadTodosFailed));
  }, [handleError]);

  useEffect(() => {
    addInputRef.current?.focus();
  }, [todos, tempTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        onTodoAdd={onTodoAdd}
        onToggleCompletedAll={onToggleCompletedAll}
        hasTodos={hasTodos}
        allAreCompleted={allAreCompleted}
        inputRef={addInputRef}
        tempTodo={!!tempTodo}
      />

      <div className="todoapp__content">
        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          processingTodos={processingTodos}
          onTodoDelete={onTodoDelete}
          onEdit={onTodoEdit}
        />
      </div>

      {hasTodos && (
        <footer className="todoapp__footer" data-cy="Footer">
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
            todos={todos}
            onDelete={onDeleteCompleted}
          />
        </footer>
      )}

      <ErrorNotification
        errorMsg={errorMsg}
        onHideError={() => setErrorMsg(ErrorType.Default)}
      />
    </div>
  );
};
