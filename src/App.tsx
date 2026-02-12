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
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const tempIdRef = useRef(0);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
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

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  const handleAddTodo = async () => {
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const tempId = --tempIdRef.current;

    setTempTodo({
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
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

  const handleRemoveTodo = async (id: number) => {
    setProcessingIds(ids => [...ids, id]);

    try {
      await todoService.deleteTodo<void>(id);
      setTodos(current => current.filter(t => t.id !== id));
      inputRef.current?.focus();
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setProcessingIds(ids => ids.filter(tid => tid !== id));
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const todoToUpdate = todos.find(t => t.id === id);

    if (!todoToUpdate) {
      return;
    }

    setProcessingIds(ids => [...ids, id]);

    try {
      const updated = await todoService.updateTodo({
        ...todoToUpdate,
        completed,
      });

      setTodos(current =>
        current.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingIds(ids => ids.filter(tid => tid !== id));
    }
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = !allCompleted;

    todos
      .filter(t => t.completed !== shouldCompleteAll)
      .forEach(t => handleToggleTodo(t.id, shouldCompleteAll));
  };

  const handleClearCompleted = () => {
    todos.filter(t => t.completed).forEach(t => handleRemoveTodo(t.id));
  };

  async function handleUpdateTitle(todo: Todo, newTitle: string) {
    if (!newTitle.trim()) {
      return handleRemoveTodo(todo.id);
    }

    if (newTitle === todo.title) {
      return;
    }

    setProcessingIds(ids => [...ids, todo.id]);

    try {
      const updated = await todoService.updateTodo({
        ...todo,
        title: newTitle,
      });

      setTodos(current =>
        current.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
      throw error;
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todo.id));
    }
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

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isProcessing={processingIds.includes(todo.id)}
                onDelete={handleRemoveTodo}
                onToggle={handleToggleTodo}
                onUpdateTitle={newTitle => handleUpdateTitle(todo, newTitle)}
              />
            ))}

            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                isProcessing
                onDelete={() => {}}
                onToggle={() => {}}
              />
            )}
          </section>
        )}

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
