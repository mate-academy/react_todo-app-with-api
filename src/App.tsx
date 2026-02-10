/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { filterTodos } from './use_cases/filterTodos';
import { TodoFilters } from './enums/TodoFilters';
import { Header } from './components/Header';
import { ErrorMessage } from './enums/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [selectedFilter, setSelectedFilter] = useState<TodoFilters>(
    TodoFilters.All,
  );
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!tempTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, todos) || [],
    [todos, selectedFilter],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const handleAddTodo = async () => {
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      completed: false,
      title: trimmedTitle,
      userId: 0,
    });

    try {
      const newTodo = await todoService.createTodo(trimmedTitle);

      setTodos(current => [...current, newTodo]);
      setTodoTitle('');
      setErrorMessage(ErrorMessage.None);
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));

      inputRef.current?.focus();
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleRemoveTodo(todo.id);
    });
  };

  const allCompleted = todos.every(todo => todo.completed);

  const handleToggleTodo = (todoToUpdate: Todo) => {
    setProcessingIds(ids => [...ids, todoToUpdate.id]);

    todoService
      .updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      })
      .then(updateTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updateTodo.id ? updateTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
      });
  };

  const handleToggleAll = () => {
    if (allCompleted) {
      todos.forEach(todo => {
        handleToggleTodo({ ...todo, completed: true });
      });
    } else {
      todos.filter(todo => !todo.completed).forEach(handleToggleTodo);
    }
  };

  async function handleUpdateTitle(todoToUpdate: Todo, newTitle: string) {
    if (newTitle === '') {
      handleRemoveTodo(todoToUpdate.id);

      return Promise.resolve();
    }

    if (newTitle === todoToUpdate.title) {
      return Promise.resolve();
    }

    setProcessingIds(ids => [...ids, todoToUpdate.id]);

    return todoService
      .updateTodo({ ...todoToUpdate, title: newTitle })
      .then(updateTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updateTodo.id ? updateTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          todoTitle={todoTitle}
          onTodoTitleChange={setTodoTitle}
          onAddTodo={handleAddTodo}
          isAllTodosCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          disabled={!!tempTodo}
          hasTodos={todos.length > 0}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => handleRemoveTodo(todo.id)}
              isProcessing={processingIds.includes(todo.id)}
              onToggle={() => handleToggleTodo(todo)}
              onUpdateTitle={newTitle => handleUpdateTitle(todo, newTitle)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              key={0}
              todo={tempTodo}
              isProcessing={true}
              onDelete={() => {}}
              onToggle={() => {}}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            activeCount={activeTodosCount}
            filter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onClearCompleted={handleClearCompleted}
            isClearCompletedDisabled={
              !todos.some(t => t.completed) || processingIds.length > 0
            }
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
