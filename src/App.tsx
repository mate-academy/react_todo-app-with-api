/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoItem } from './components/TodoItem';
import { Error } from './components/Error';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { Errors } from './types/Errors';
import { USER_ID } from './utils/consts';

export const App: React.FC = () => {
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(Status.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((res) => setTodos(res));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  function filteredTodos() {
    if (activeFilter === Status.All) {
      return todos;
    }

    if (activeFilter === Status.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (activeFilter === Status.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  const filteredTodosList: Todo[] = filteredTodos();

  function onDelete(todoId: number) {
    todoService.deleteTodo(todoId).then(() => {
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    }).catch(() => {
      setError(Errors.Delete);
    });
  }

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    todoService.createTodo({ userId, title, completed })
      .then(newTodos => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodos as Todo]);
      })
      .catch(() => {
        setError(Errors.Add);
      });
  }

  function renameTodo(todoToUpdate: Todo, newTitle: string) {
    setProcessingIds(current => [...current, todoToUpdate.id]);

    return todoService.updateTodo({
      ...todoToUpdate,
      title: newTitle,
    })
      .then((updatedTodo) => {
        setTodos((current) => current.map((todo) => (
          todo.id === todoToUpdate.id ? updatedTodo : todo
        )) as Todo[]);

        inputRef.current?.focus();
      })
      .finally(() => {
        setProcessingIds(
          current => current.filter(id => id !== todoToUpdate.id),
        );
      })
      .catch(() => {
        setError(Errors.Update);
      });
  }

  function toggleTodo(todoToUpdate: Todo) {
    setProcessingIds(current => [...current, todoToUpdate.id]);

    return todoService.updateTodo({ ...todoToUpdate, completed: !todoToUpdate.completed })
      .then((updatedTodo: any) => setTodos(current => current.map((todo) => (
        todo.id === updatedTodo.id ? updatedTodo : todo
      )) as Todo[]))
      .catch(() => {
        setError(Errors.Update);
      })
      .finally(() => {
        setProcessingIds(
          current => current.filter(id => id !== todoToUpdate.id),
        );
        inputRef.current?.focus();
      });
  }

  const toggleAll = () => {
    const active = filteredTodosList.filter(todo => !todo.completed);
    const completed = filteredTodosList.filter(todo => todo.completed);

    if (active.length !== 0) {
      active.forEach(todo => toggleTodo(todo));
    } else {
      completed.forEach(todo => toggleTodo(todo));
    }
  };

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim() === '') {
      setError(Errors.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: newTodo.trim(),
      completed: false,
      userId: 0,
    });

    addTodo({
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    });

    setNewTodo('');
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => todoService.deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setError(Errors.Completed);
      });
  };

  const handleFilterChange = (filter: Status) => {
    setActiveFilter(filter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toggleAll={toggleAll}
          filtredTodo={filteredTodosList}
          newTodo={newTodo}
          handleNewTodoSubmit={handleNewTodoSubmit}
          handleNewTodoChange={handleNewTodoChange}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodosList.map(todo => (
            <TodoItem
              todo={todo}
              setError={() => setError(null)}
              onDelete={() => onDelete(todo.id)}
              onToggle={() => toggleTodo(todo)}
              onRename={newTitle => renameTodo(todo, newTitle)}
              loading={processingIds.includes(todo.id)}
            />
          ))}
        </section>

        {filteredTodosList.length !== 0 && (
          <Footer
            filteredTodosList={filteredTodosList}
            activeFilter={activeFilter}
            tempTodo={todos}
            handleClearCompleted={handleClearCompleted}
            handleFilterChange={handleFilterChange}
          />
        )}
      </div>

      <Error
        error={error}
        setError={() => setError(null)}
      />
    </div>
  );
};
