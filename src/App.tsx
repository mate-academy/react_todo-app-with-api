/* eslint-disable max-len */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Errors, Filters } from './types/enums';
import { USER_ID } from './consts/consts';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [prepariedTodos, setPrepariedTodos] = useState<Todo[]>([]);

  const [filterMethod, setFilterMethod] = useState(Filters.all);
  const [errorMessage, setErrorMessage] = useState('');

  const [todoTitle, setTodoTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [todoOnDeleting, setTodoOnDeleting] = useState<number | null>(null);
  const [todosOnDeleting, setTodosOnDeleting] = useState<number[]>([]);

  const [todoOnUpdating, setTodoOnUpdating] = useState<number | null>(null);
  const [todosOnUpdating, setTodosOnUpdating] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitile] = useState('');
  const editTitleRef = useRef<HTMLInputElement>(null);

  const isAllTodosCompleted = prepariedTodos.every(todo => todo.completed);
  const itemsLeft = prepariedTodos.filter(todo => !todo.completed);

  useEffect(() => {
    titleRef.current?.focus();
    const loadingTodos = async () => {
      try {
        const todos = await getTodos();

        setPrepariedTodos(todos);
      } catch {
        setErrorMessage(Errors.loadingTodos);
      }
    };

    loadingTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const errorTimer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [errorMessage]);

  const getFilteredTodos = (todos: Todo[], query: string) => {
    switch (query) {
      case Filters.active:
        return todos.filter(todo => !todo.completed);
      case Filters.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handledTodos = tempTodo
    ? [...prepariedTodos, tempTodo]
    : prepariedTodos;

  const filteredTodos = getFilteredTodos(handledTodos, filterMethod);

  const focusTitleInput = useCallback(() => {
    if (titleRef.current && editingTodoId === null) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 0);
    }
  }, [editingTodoId]);

  const handleSettingTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoTitle(event.target.value);
    },
    [],
  );

  const handleEditing = useCallback((todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitile(todo.title);
  }, []);

  const handleEditingChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditingTodoTitile(event.target.value);
    },
    [],
  );

  const handleEditCancel = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditingTodoId(null);
      }
    },
    [],
  );

  const handleAddingNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage(Errors.emptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todoResponse = await addTodo(newTodo);

      setPrepariedTodos(currentTodos => [...currentTodos, todoResponse]);
      setTodoTitle('');
    } catch {
      setErrorMessage(Errors.addingTodo);
    } finally {
      setTempTodo(null);
      focusTitleInput();
    }
  };

  const handleDeletingTodo = async (id: number) => {
    try {
      setTodoOnDeleting(id);
      await deleteTodo(id);

      setPrepariedTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== id),
      );
    } catch {
      setErrorMessage(Errors.deletingTodo);
    } finally {
      setTodoOnDeleting(null);
      focusTitleInput();
    }
  };

  const handleDeletingTodos = async () => {
    const completedTodos = prepariedTodos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setTodosOnDeleting(currentIds => [...currentIds, ...completedTodosIds]);

    try {
      const results = await Promise.allSettled(
        completedTodosIds.map(todoId => deleteTodo(todoId)),
      );

      const successfulIds = completedTodos
        .filter((_todo, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage(Errors.deletingTodo);
      }

      if (successfulIds.length > 0) {
        setPrepariedTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      }
    } catch {
      setErrorMessage(Errors.deletingTodo);
    } finally {
      setTodosOnDeleting(currentTodosIds =>
        currentTodosIds?.filter(id => !completedTodosIds.includes(id)),
      );
      focusTitleInput();
    }
  };

  const handleChangeCompletedStatus = async (todo: Todo) => {
    try {
      setTodoOnUpdating(todo.id);
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setPrepariedTodos(currentTodos =>
        currentTodos.map(curTodo =>
          curTodo.id === updatedTodo.id ? updatedTodo : curTodo,
        ),
      );
    } catch {
      setErrorMessage(Errors.updatingTodo);
    } finally {
      setTodoOnUpdating(null);
    }
  };

  const handleUncompletedTodos = async () => {
    const newStatus = !isAllTodosCompleted;
    const todosToUpdate = prepariedTodos.filter(
      todo => todo.completed !== newStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const updatingIds = todosToUpdate.map(todo => todo.id);

    setTodosOnUpdating(currentIds => [...currentIds, ...updatingIds]);

    try {
      const results = await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newStatus }),
        ),
      );

      const successfulUpdates = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Todo>).value.id);

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage(Errors.updatingTodo);
      }

      setPrepariedTodos(currentTodos =>
        currentTodos.map(todo =>
          successfulUpdates.includes(todo.id)
            ? { ...todo, completed: newStatus }
            : todo,
        ),
      );
    } catch {
      setErrorMessage(Errors.updatingTodo);
    } finally {
      setTodosOnUpdating(currentIds =>
        currentIds.filter(id => !updatingIds.includes(id)),
      );
    }
  };

  const handleEditSave = async () => {
    if (editingTodoId === null) {
      return;
    }

    const newTitle = editingTodoTitle.trim();
    const originalTodo = prepariedTodos.find(todo => todo.id === editingTodoId);

    if (newTitle === '') {
      try {
        setTodoOnDeleting(editingTodoId);
        await deleteTodo(editingTodoId);
        setPrepariedTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== editingTodoId),
        );
        setEditingTodoId(null);
      } catch {
        setErrorMessage(Errors.deletingTodo);
      } finally {
        setTodoOnDeleting(null);
      }

      return;
    }

    if (originalTodo && newTitle === originalTodo.title) {
      setEditingTodoId(null);

      return;
    }

    try {
      setTodoOnUpdating(editingTodoId);

      const updatedTodo = await updateTodo(editingTodoId, { title: newTitle });

      setPrepariedTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
      setEditingTodoId(null);
    } catch {
      setErrorMessage(Errors.updatingTodo);
    } finally {
      setTodoOnUpdating(null);
    }
  };

  const todoActions = {
    onToggle: handleChangeCompletedStatus,
    onSave: handleEditSave,
    onChange: handleEditingChange,
    onCancel: handleEditCancel,
    onEdit: handleEditing,
    onDelete: handleDeletingTodo,
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          prepariedTodos={prepariedTodos}
          todoTitle={todoTitle}
          tempTodo={tempTodo}
          handleUncompletedTodos={handleUncompletedTodos}
          handleAddingNewTodo={handleAddingNewTodo}
          handleSettingTitle={handleSettingTitle}
          ref={titleRef}
        />

        <TodoList
          todos={filteredTodos}
          editingTodoId={editingTodoId}
          editingTodoTitle={editingTodoTitle}
          todoOnDeleting={todoOnDeleting}
          todoOnUpdating={todoOnUpdating}
          todosOnDeleting={todosOnDeleting}
          todosOnUpdating={todosOnUpdating}
          actions={todoActions}
          ref={editTitleRef}
        />

        {prepariedTodos.length !== 0 && (
          <Footer
            prepariedTodos={prepariedTodos}
            itemsLeft={itemsLeft}
            filterMethod={filterMethod}
            setFilterMethod={setFilterMethod}
            handleDeletingTodos={handleDeletingTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
