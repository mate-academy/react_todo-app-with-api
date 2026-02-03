/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { Header, TodoList, Footer, ErrorNotification } from './components';

const getFilteredTodos = (todos: Todo[], filterBy: string) => {
  switch (filterBy) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);

    case Filter.Completed:
      return todos.filter(todo => todo.completed);

    case Filter.All:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosWithTempTodo = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = getFilteredTodos(todosWithTempTodo, filterBy);

  const field = useRef<HTMLInputElement>(null);
  const editField = useRef<HTMLInputElement>(null);

  const filters = [Filter.All, Filter.Active, Filter.Completed];

  useEffect(() => {
    setIsLoading(true);
    setError(ErrorMessage.None);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  const allTodosCompleted = useCallback(
    (incomeTodos: Todo[]) =>
      incomeTodos.length > 0 && incomeTodos.every(todo => todo.completed),
    [],
  );

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError(ErrorMessage.None);
    setIsLoading(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    addTodo({
      title: normalizedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setIsLoading(true);
    setProcessingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todoId));
        setIsLoading(false);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsLoading(true);
    setProcessingIds(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => setError(ErrorMessage.Delete)),
    );

    Promise.allSettled(deletePromises).finally(() => {
      setProcessingIds([]);
      setIsLoading(false);
    });
  };

  const handleChangeStatus = (todo: Todo) => {
    setIsLoading(true);
    setProcessingIds(prev => [...prev, todo.id]);
    const newCompleted = !todo.completed;

    updateTodo({ ...todo, completed: newCompleted })
      .then(() => {
        setTodos(prev =>
          prev.map(currentTodo =>
            currentTodo.id === todo.id
              ? { ...currentTodo, completed: newCompleted }
              : currentTodo,
          ),
        );
      })
      .catch(() => setError(ErrorMessage.Update))
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todo.id));
        setIsLoading(false);
      });
  };

  const handleToggleAllButton = (incomeTodos: Todo[]) => {
    const allCompleted = allTodosCompleted(incomeTodos);
    const newStatus = !allCompleted;

    const todoForUpdate = incomeTodos.filter(
      todo => todo.completed !== newStatus,
    );

    setProcessingIds(todoForUpdate.map(todo => todo.id));
    setIsLoading(true);

    todoForUpdate.forEach(todo => {
      updateTodo({ ...todo, completed: newStatus })
        .then(() => {
          setTodos(prev =>
            prev.map(currentTodo =>
              currentTodo.id === todo.id
                ? { ...currentTodo, completed: newStatus }
                : currentTodo,
            ),
          );
        })
        .catch(() => setError(ErrorMessage.Update))
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
          setIsLoading(false);
        });
    });
  };

  const handleFinishingEditing = () => {
    if (!editingTodo) {
      return;
    }

    const newTitle = editingTodo.title.trim();
    const originalTodo = todos.find(t => t.id === editingTodo.id);

    if (!originalTodo) {
      setEditingTodo(null);

      return;
    }

    if (newTitle === originalTodo.title) {
      setEditingTodo(null);

      return;
    }

    if (newTitle === '') {
      handleDelete(editingTodo.id);

      return;
    }

    setProcessingIds(prev => [...prev, editingTodo.id]);

    updateTodo({ ...originalTodo, title: newTitle })
      .then(() => {
        setTodos(prev =>
          prev.map(currentTodo =>
            currentTodo.id === editingTodo.id
              ? { ...currentTodo, title: newTitle }
              : currentTodo,
          ),
        );
        setEditingTodo(null);
      })
      .catch(() => setError(ErrorMessage.Update))
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== editingTodo.id));
      });
  };

  const handleSubmitEdit = (event: React.FormEvent) => {
    event.preventDefault();
    handleFinishingEditing();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          todos={todos}
          allTodosCompleted={allTodosCompleted}
          handleToggleAllButton={handleToggleAllButton}
          handleSubmit={handleSubmit}
          field={field}
          processingIds={processingIds}
          editingTodo={editingTodo}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          handleChangeStatus={handleChangeStatus}
          editingTodo={editingTodo}
          handleSubmitEdit={handleSubmitEdit}
          editField={editField}
          setEditingTodo={setEditingTodo}
          handleFinishingEditing={handleFinishingEditing}
          handleDelete={handleDelete}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filters={filters}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            hasCompleted={hasCompleted}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
