import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { API_URL, ErrorMessage, RESPONSE_DELAY } from './constants/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { getUserId } from './utils/getUserId';
import { request } from './utils/request';
import { wait } from './utils/wait';

export const App: React.FC = () => {
  const userId = getUserId();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const errorTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);
  const editField = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);

    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const hideError = () => {
    setErrorMessage('');

    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }
  };

  const focusNewTodoField = () => {
    setTimeout(() => newTodoField.current?.focus(), 0);
  };

  const addProcessingId = (id: number) => {
    setProcessingIds(current => [...current, id]);
  };

  const removeProcessingId = (id: number) => {
    setProcessingIds(current => current.filter(currentId => currentId !== id));
  };

  const loadTodos = async () => {
    try {
      const loadedTodos = await request<Todo[]>(`${API_URL}?userId=${userId}`);

      setTodos(loadedTodos);
    } catch {
      showError(ErrorMessage.Load);
    } finally {
      focusNewTodoField();
    }
  };

  useEffect(() => {
    if (userId) {
      loadTodos();
    }

    return () => {
      if (errorTimerId.current) {
        clearTimeout(errorTimerId.current);
      }
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editingId !== null) {
      editField.current?.focus();
    }
  }, [editingId]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filter, todos]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const allTodosCompleted = todos.length > 0 && activeTodosCount === 0;
  const shouldShowTempTodo = tempTodo && filter !== 'completed';

  const createTodo = async (event: FormEvent) => {
    event.preventDefault();
    hideError();

    const title = newTitle.trim();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);
      focusNewTodoField();

      return;
    }

    const optimisticTodo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(optimisticTodo);
    setIsAdding(true);

    try {
      const createdTodo = await request<Todo>(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          title,
          completed: false,
        }),
      });

      await wait(RESPONSE_DELAY);
      setTodos(current => [...current, createdTodo]);
      setNewTitle('');
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
      focusNewTodoField();
    }
  };

  const deleteTodo = async (todoId: number, shouldFocusNewTodo = true) => {
    hideError();
    addProcessingId(todoId);

    try {
      await fetch(`${API_URL}/${todoId}`, {
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          throw new Error(String(response.status));
        }
      });

      await wait(RESPONSE_DELAY);
      setTodos(current => current.filter(todo => todo.id !== todoId));

      if (editingId === todoId) {
        setEditingId(null);
      }
    } catch {
      showError(ErrorMessage.Delete);
      throw new Error(ErrorMessage.Delete);
    } finally {
      removeProcessingId(todoId);
      if (shouldFocusNewTodo) {
        focusNewTodoField();
      }
    }
  };

  const updateTodo = async (
    todoId: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    hideError();
    addProcessingId(todoId);

    try {
      const updatedTodo = await request<Todo>(`${API_URL}/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      await wait(RESPONSE_DELAY);
      setTodos(current =>
        current.map(todo =>
          todo.id === todoId ? { ...todo, ...updatedTodo } : todo,
        ),
      );

      return updatedTodo;
    } catch {
      showError(ErrorMessage.Update);
      throw new Error(ErrorMessage.Update);
    } finally {
      removeProcessingId(todoId);
    }
  };

  const toggleTodo = (todo: Todo) => {
    updateTodo(todo.id, { completed: !todo.completed }).catch(() => {});
  };

  const toggleAll = async () => {
    const completed = !allTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    await Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed }).catch(() => undefined),
      ),
    );
  };

  const deleteCompletedTodos = async () => {
    await Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodo(todo.id).catch(() => undefined)),
    );
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEditing = async (todo: Todo) => {
    const title = editingTitle.trim();

    if (title === todo.title) {
      cancelEditing();

      return;
    }

    if (!title) {
      try {
        await deleteTodo(todo.id, false);
      } catch {
        return;
      }

      return;
    }

    try {
      await updateTodo(todo.id, { title });
      cancelEditing();
    } catch {
      editField.current?.focus();
    }
  };

  const handleEditSubmit = (event: FormEvent, todo: Todo) => {
    event.preventDefault();
    saveEditing(todo);
  };

  const handleEditKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          allTodosCompleted={allTodosCompleted}
          newTitle={newTitle}
          isAdding={isAdding}
          newTodoField={newTodoField}
          onNewTitleChange={setNewTitle}
          onCreateTodo={createTodo}
          onToggleAll={toggleAll}
        />

        {(todos.length > 0 || shouldShowTempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={shouldShowTempTodo ? tempTodo : null}
            editingId={editingId}
            editingTitle={editingTitle}
            processingIds={processingIds}
            editField={editField}
            onToggleTodo={toggleTodo}
            onDeleteTodo={todoId => deleteTodo(todoId).catch(() => {})}
            onStartEditing={startEditing}
            onEditingTitleChange={setEditingTitle}
            onEditSubmit={handleEditSubmit}
            onEditBlur={saveEditing}
            onEditKeyUp={handleEditKeyUp}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            selectedFilter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onHide={hideError} />
    </div>
  );
};
