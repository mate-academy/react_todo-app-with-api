/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { errors } from './constans/Errors';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { Status } from './types/Status';
import * as todoServise from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.All);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeTempTodo = () => {
    setTempTodo(null);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(errors.load);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(''), 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setError('');
    setIsSubmitting(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: todoServise.USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });
    setLoadingTodos(prevLoadingTodos => [...prevLoadingTodos, 0]);

    return todoServise
      .createTodos({ title, userId, completed })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
        setTempTodo(null);
      })
      .catch(catchError => {
        setError(errors.add);
        throw catchError;
      })
      .finally(() => {
        removeTempTodo();
        setIsSubmitting(false);
        setLoadingTodos(prevLoadingTodos =>
          prevLoadingTodos.filter(todoId => todoId !== 0),
        );
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  }

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(curr => [...curr, todoId]);
    setError('');

    return todoServise
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(catchError => {
        setError(errors.delete);
        throw catchError;
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setLoadingTodos(curr =>
          curr.filter(deletingTodoId => todoId !== deletingTodoId),
        );
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllComleted = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleUpdateTodo = (todo: Todo): Promise<void> => {
    setError('');
    setLoadingTodos(current => [...current, todo.id]);

    return todoServise
      .updateTodos(todo)
      .then(updateTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updateTodo.id ? updateTodo : currentTodo,
          ),
        ),
      )
      .catch(catchError => {
        setError(errors.update);
        throw catchError;
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  const toggleAllTodos = (completed: boolean) => {
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    todosToUpdate.forEach(todo =>
      handleUpdateTodo({
        ...todo,
        completed,
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          onSubmit={addTodo}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          inputRef={inputRef}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          onToggleAll={toggleAllTodos}
        />

        {todos.length !== 0 && (
          <TodoList
            todos={todos}
            selectedFilter={selectedFilter}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            tempTodo={tempTodo}
            loadingTodos={loadingTodos}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            setError={setError}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={deleteAllComleted}
          />
        )}
      </div>
      <Errors error={error} setError={setError} isSubmitting={isSubmitting} />
    </div>
  );
};
