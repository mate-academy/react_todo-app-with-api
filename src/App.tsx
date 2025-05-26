/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  deleteTodo,
  addTodo,
  completeTodo,
  renameTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const activeCount = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  function filterTodos() {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todos;
    }
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    setIsAdding(true);
    addTodo(newTodo)
      .then(todoItem => {
        setTodos(prevTodos => [...prevTodos, todoItem]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        inputRef.current?.focus();
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = completedTodos.map(todo => todo.id);

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(results => {
        const failedDeletions = completedIds.filter(
          (_, index) => results[index].status === 'rejected',
        );

        setTodos(currentTodos =>
          currentTodos.filter(
            todo =>
              !completedIds.includes(todo.id) ||
              failedDeletions.includes(todo.id),
          ),
        );

        if (failedDeletions.length > 0) {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => inputRef.current?.focus());
  };

  const handleDelete = (todoId: number) => {
    setLoadingTodoId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        inputRef.current?.focus();
        setLoadingTodoId(null);
      });
  };

  const handleComplete = (todoId: number) => {
    const currentTodo = todos.find(todo => todo.id === todoId);

    if (!currentTodo) {
      return;
    }

    const newCompletionState = !currentTodo.completed;

    setLoadingTodoId(todoId);
    completeTodo(todoId, newCompletionState)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId
              ? { ...todo, completed: newCompletionState }
              : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  };

  const handleCompleteAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletionState = !allCompleted;

    const todosToUpdate = newCompletionState
      ? todos.filter(todo => !todo.completed)
      : todos;

    const todoIdsToUpdate = todosToUpdate.map(todo => todo.id);

    Promise.allSettled(
      todoIdsToUpdate.map(id => completeTodo(id, newCompletionState)),
    )
      .then(results => {
        const failedUpdates = todoIdsToUpdate.filter(
          (_, index) => results[index].status === 'rejected',
        );

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todoIdsToUpdate.includes(todo.id)
              ? { ...todo, completed: newCompletionState }
              : todo,
          ),
        );

        if (failedUpdates.length > 0) {
          setErrorMessage('Unable to update todos');
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update todos');
      });
  };

  const filteredTodos = filterTodos();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSaveEdit = (todoId: number) => {
    const trimmedTitle = editingTitle.trim();

    const currentTodo = todos.find(todo => todo.id === todoId);

    if (currentTodo && trimmedTitle === currentTodo.title) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedTitle === '') {
      handleDelete(todoId);
    } else {
      setLoadingTodoId(todoId);

      renameTodo(todoId, trimmedTitle)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
            ),
          );
          setEditingTodoId(null);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setLoadingTodoId(null);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleEditTodo = (todoId: number, title: string) => {
    setEditingTodoId(todoId);
    setEditingTitle(title);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          setNewTodoTitle={setNewTodoTitle}
          handleAddTodo={handleAddTodo}
          handleCompleteAll={handleCompleteAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleEditTodo={handleEditTodo}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          setEditingTitle={setEditingTitle}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          errorMessage
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'hidden'
        }
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
