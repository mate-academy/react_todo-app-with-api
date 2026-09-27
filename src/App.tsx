import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';

function getVisibleTodos(todos: Todo[], selectedFilter: Filter) {
  if (selectedFilter === Filter.All) {
    return todos;
  }

  return todos.filter(
    todo => todo.completed === (selectedFilter === Filter.Completed),
  );
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [togglingTodoIds, setTogglingTodoIds] = useState<number[]>([]);
  const [renamingTodoId, setRenamingTodoId] = useState<number | null>(null);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, selectedFilter),
    [todos, selectedFilter],
  );

  const editInput = useRef<HTMLInputElement>(null);
  const errorTimerId = useRef<NodeJS.Timeout>();

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAddingTodo) {
      editInput.current?.focus();
    }
  }, [isAddingTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle === '') {
      showError('Title should not be empty');

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: todoService.USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(todoToAdd);
    setIsAddingTodo(true);

    todoService
      .createTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
      });
  };

  const handleDelete = (todoToDelete: Todo) => {
    setDeletingTodoId(todoToDelete.id);

    todoService
      .deleteTodo(todoToDelete.id)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter(({ id }) => id !== todoToDelete.id),
        ),
      )
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setDeletingTodoId(null);

        editInput.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const deletedRequests = completedTodos.map(({ id }) =>
      todoService.deleteTodo(id),
    );

    Promise.allSettled(deletedRequests).then(results => {
      const successfullyDeletedTodos: Todo[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfullyDeletedTodos.push(completedTodos[index]);
        }
      });

      setTodos(prevTodos =>
        prevTodos.filter(
          todo =>
            !successfullyDeletedTodos.some(
              deletedTodo => deletedTodo.id === todo.id,
            ),
        ),
      );

      if (results.some(result => result.status === 'rejected')) {
        showError('Unable to delete a todo');
      }

      editInput.current?.focus();
    });
  };

  const handleToggleTodo = (todoToUpdate: Todo) => {
    setTogglingTodoIds(prevTodoIds => [...prevTodoIds, todoToUpdate.id]);

    return todoService
      .updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() =>
        setTogglingTodoIds(prevTodoIds =>
          prevTodoIds.filter(id => id !== todoToUpdate.id),
        ),
      );
  };

  const handleRenameTodo = (todoToUpdate: Todo, newTitle: string) => {
    setRenamingTodoId(todoToUpdate.id);

    return todoService
      .updateTodo({
        ...todoToUpdate,
        title: newTitle,
      })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
        throw new Error();
      })
      .finally(() => {
        setRenamingTodoId(null);
      });
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = todos.every(({ completed }) => completed);

    return Promise.allSettled(
      todos
        .filter(({ completed }) => completed === shouldCompleteAll)
        .map(handleToggleTodo),
    );
  };

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed === true).length;
  }, [todos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          completedTodosCount={completedTodosCount}
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          editInput={editInput}
          isLoading={isLoading}
          isAddingTodo={isAddingTodo}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              deletingTodoId={deletingTodoId}
              togglingTodoIds={togglingTodoIds}
              renamingTodoId={renamingTodoId}
              onDelete={handleDelete}
              onToggle={handleToggleTodo}
              onRename={handleRenameTodo}
            />

            {tempTodo !== null && (
              <TodoItem todo={tempTodo} isLoading={isAddingTodo} />
            )}

            {todos.length > 0 && (
              <Footer
                activeTodosCount={activeTodosCount}
                completedTodosCount={completedTodosCount}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
