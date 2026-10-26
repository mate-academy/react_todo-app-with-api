/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Todo } from './types/Todo';
import { FILTERS } from './utils/constants';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/Erros';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>(FILTERS.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(t => !t.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(t => t.completed);
  }, [todos]);

  const allCompleted = todos.length > 0 && activeTodosCount === 0;

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  const addTodo = ({
    userId,
    title: todoTitle,
    completed,
  }: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    setIsAddingTodo(true);

    setTempTodo({
      id: 0,
      userId,
      title: todoTitle,
      completed,
    });

    todoService
      .postTodos({ userId, title: todoTitle, completed })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsAddingTodo(false);
        setTempTodo(null);
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, todoId]);

    return todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');

    if (!updatedTodo.title.trim()) {
      return deleteTodo(updatedTodo.id);
    }

    setProcessingTodoIds(current => [...current, updatedTodo.id]);

    return todoService
      .updateTodos(updatedTodo)
      .then(serverTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === serverTodo.id ? serverTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(currentIds =>
          currentIds.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const toggleAll = async () => {
    const targetStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingTodoIds(currentIds => [...currentIds, ...idsToUpdate]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        todoService.updateTodos({ ...todo, completed: targetStatus }),
      ),
    );

    const successfulUpdates: Todo[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successfulUpdates.push(result.value);
      }
    });

    if (successfulUpdates.length < todosToUpdate.length) {
      setErrorMessage('Unable to update a todo');
    }

    setTodos(currentTodos =>
      currentTodos.map(todo => {
        const updatedTodo = successfulUpdates.find(t => t.id === todo.id);

        return updatedTodo || todo;
      }),
    );

    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !idsToUpdate.includes(id)),
    );
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');

    const completedIds = completedTodos.map(todo => todo.id);

    setProcessingTodoIds(currentIds => [...currentIds, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodos(todo.id)),
    );

    const successfullyDeletedIds: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(completedTodos[index].id);
      }
    });

    if (successfullyDeletedIds.length < completedTodos.length) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );

    setTimeout(() => {
      newTodoFieldRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    setErrorMessage('');
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          allCompleted={allCompleted}
          handleSubmit={handleSubmit}
          newTodoFieldRef={newTodoFieldRef}
          title={title}
          setTitle={setTitle}
          isAdding={isAddingTodo}
          onToggleAll={toggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              tempTodo={tempTodo}
              processingTodoIds={processingTodoIds}
            />

            <Footer
              activeTodosCount={activeTodosCount}
              filter={filter}
              onFilterChange={setFilter}
              hasCompletedTodos={hasCompletedTodos}
              onClearCompleted={clearCompleted}
            />
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
