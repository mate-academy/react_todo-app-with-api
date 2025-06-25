import React, { useState, useEffect } from 'react';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './types/TodoFilter';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = todos.filter(todo => {
    if (loadingTodoId !== null && todo.id === loadingTodoId) {
      return true;
    }

    if (filter === TodoFilter.Active) {
      return !todo.completed;
    }

    if (filter === TodoFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  function loadTodos() {
    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  async function addTodo(title: string) {
    const newTempTodo = {
      userId: USER_ID,
      id: 0,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodoId(0);

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
      throw new Error('Empty title');
    }

    try {
      const createdTodo = await todoService.addTodo(title.trim());
      const newTodo = createdTodo as Todo;

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => setErrorMessage(''), 3000);
      throw new Error('Failed to add todo');
    } finally {
      setLoadingTodoId(null);
      setTempTodo(null);
    }
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  }

  function updateTodo(todoToUpdate: Omit<Todo, 'userId'>): Promise<void> {
    setLoadingTodoId(todoToUpdate.id);

    return todoService
      .editTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);

        return Promise.reject();
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  }

  async function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const successfulIds: number[] = [];

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulIds.push(completedTodos[index].id);
      } else {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    });

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
  }

  function toggleAllTodos() {
    const shouldComplete = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoId(-1);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        todoService.editTodo({
          id: todo.id,
          title: todo.title,
          completed: shouldComplete,
        }),
      ),
    )
      .then(results => {
        const updatedIds = todosToUpdate
          .map((todo, i) =>
            results[i].status === 'fulfilled' ? todo.id : null,
          )
          .filter((id): id is number => id !== null);

        setTodos(prev =>
          prev.map(todo =>
            updatedIds.includes(todo.id)
              ? { ...todo, completed: shouldComplete }
              : todo,
          ),
        );

        if (updatedIds.length !== todosToUpdate.length) {
          setErrorMessage('Some todos could not be updated');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .catch(() => {
        setErrorMessage('Unable to toggle all todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  }

  useEffect(loadTodos, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} addTodo={addTodo} toggleAll={toggleAllTodos} />

        <TodoList
          todos={visibleTodos}
          onDelete={deleteTodo}
          loadingTodoId={loadingTodoId}
          onUpdate={updateTodo}
        />

        {tempTodo && (
          <TodoItem
            {...tempTodo}
            loadingTodoId={loadingTodoId}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
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
