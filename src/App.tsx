import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

function getVisibleTodos(
  todos: Todo[],
  filter: string,
  processingTodoIds: number[],
) {
  let newTodosList = [...todos];

  if (filter) {
    switch (filter) {
      case FilterType.Active:
        newTodosList = newTodosList.filter(
          todo => !todo.completed || processingTodoIds.includes(todo.id),
        );
        break;
      case FilterType.Completed:
        newTodosList = newTodosList.filter(
          todo => todo.completed || processingTodoIds.includes(todo.id),
        );
        break;
      case FilterType.All:
      default:
        break;
    }
  }

  return newTodosList;
}

function getActiveTodosCounter(todos: Todo[]) {
  return todos.filter(todo => !todo.completed).length;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleHideError = () => {
    setErrorMessage('');
  };

  const handleAddTodo = async (title: string) => {
    setErrorMessage('');
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setProcessingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch (error) {
      showError('Unable to delete a todo');
      throw error;
    } finally {
      setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleClearCompletedTodos = async () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setProcessingTodoIds(prevIds => [...prevIds, ...idsToDelete]);

    const deletionPromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(_error => {
          return { id: todo.id, success: false };
        }),
    );

    const results = await Promise.all(deletionPromises);

    const failedDeletionExist = results.some(res => !res.success);

    if (failedDeletionExist) {
      showError('Unable to delete a todo');
    }

    const successfullyDeletedIds = results
      .filter(res => res.success)
      .map(res => res.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setProcessingTodoIds(prevIds =>
      prevIds.filter(id => !idsToDelete.includes(id)),
    );
    if (
      editingTodoId !== null &&
      successfullyDeletedIds.includes(editingTodoId)
    ) {
      setEditingTodoId(null);
    }

    inputRef.current?.focus();
  };

  const handleToggleTodoStatus = async (todoId: number) => {
    setErrorMessage('');
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      showError('Todo not found');

      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    setProcessingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await updateTodo(todoId, { completed: !todoToUpdate.completed });
    } catch (error) {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: todoToUpdate.completed }
            : todo,
        ),
      );
      showError('Unable to update a todo');
    } finally {
      setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleToggleAllTodos = async () => {
    setErrorMessage('');
    const allTodosAreCompleted = todos.every(todo => todo.completed);
    const targetCompletedStatus = !allTodosAreCompleted;

    const todosToToggle = todos.filter(
      todo => todo.completed !== targetCompletedStatus,
    );
    const idsToToggle = todosToToggle.map(todo => todo.id);

    if (idsToToggle.length === 0) {
      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        idsToToggle.includes(todo.id)
          ? { ...todo, completed: targetCompletedStatus }
          : todo,
      ),
    );
    setProcessingTodoIds(prevIds => [...prevIds, ...idsToToggle]);

    const updatePromises = todosToToggle.map(todo =>
      updateTodo(todo.id, { completed: targetCompletedStatus })
        .then(() => ({ id: todo.id, success: true }))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(_error => {
          return { id: todo.id, success: false };
        }),
    );

    const results = await Promise.all(updatePromises);

    const failedUpdateExist = results.some(res => !res.success);

    if (failedUpdateExist) {
      showError('Unable to update a todo');
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const result = results.find(r => r.id === todo.id);

          if (result && !result.success) {
            const originalTodo = todos.find(t => t.id === todo.id);

            return originalTodo
              ? { ...todo, completed: originalTodo.completed }
              : todo;
          }

          return todo;
        }),
      );
    }

    setProcessingTodoIds(prevIds =>
      prevIds.filter(id => !idsToToggle.includes(id)),
    );
  };

  const handleRenameTodo = async (todoId: number, newTitle: string) => {
    setErrorMessage('');
    const trimmedTitle = newTitle.trim();
    const originalTodo = todos.find(todo => todo.id === todoId);

    if (!originalTodo) {
      showError('Todo not found');
      setEditingTodoId(null);

      return;
    }

    if (!trimmedTitle) {
      try {
        await handleDeleteTodo(todoId);
        inputRef.current?.focus();
        setEditingTodoId(null);
      } catch (error) {
        showError('Unable to delete a todo');
      }

      return;
    }

    if (trimmedTitle === originalTodo.title) {
      setEditingTodoId(null);

      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
      ),
    );
    setProcessingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await updateTodo(todoId, { title: trimmedTitle });
      setEditingTodoId(null);
      inputRef.current?.focus();
    } catch (error) {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: originalTodo.title } : todo,
        ),
      );
      showError('Unable to update a todo');
    } finally {
      setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    setErrorMessage('');
    setIsLoadingTodos(true);
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setIsLoadingTodos(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos: Todo[] = getVisibleTodos(
    todos,
    filter,
    processingTodoIds,
  );
  const activeTodosCounter = getActiveTodosCounter(todos);
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allTodosAreCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          inputRef={inputRef}
          allTodosAreCompleted={allTodosAreCompleted}
          onToggleAllTodos={handleToggleAllTodos}
          todosLength={todos.length}
          isLoadingTodos={isLoadingTodos}
        />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodoStatus={handleToggleTodoStatus}
          processingTodoIds={processingTodoIds}
          tempTodo={tempTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          onRenameTodo={handleRenameTodo}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            activeTodosCounter={activeTodosCounter}
            deleteCompletedTodos={handleClearCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHide={handleHideError} />
    </div>
  );
};
