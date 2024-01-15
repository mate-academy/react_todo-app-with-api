/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoError } from './components/TodoError';
import { ErrorMessageEnum } from './types/ErrorMessageEnum';
import * as postService from './api/todos';
import cn from 'classnames';

const USER_ID = 11385;

export const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessageEnum | null>(null);
  const [hasMistake, setHasMistake] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    postService.getTodo(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessageEnum.TodoLoadError));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      setHasMistake(true);

      timeoutId = setTimeout(() => {
        setHasMistake(false);
        setErrorMessage(null);
      }, 3000);
    } else {
      setHasMistake(false);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilter = (newFilter: string) => {
    setActiveFilter(newFilter);
  };

  const handleTodoEdit = (todoId: number, newTitle: string) => {
    postService.updateTodo(todoId, {
      title: newTitle,
    })
      .then((updatedTodo: Todo) => setTodos(prevTodos => prevTodos
        .map(todo => (todo.id === updatedTodo.id
          ? { ...todo, title: updatedTodo.title }
          : { ...todo }))));
  };

  const handleTodoCompletedUpdate = (todoId: number, newCompleted: boolean) => {
    postService.updateTodo(todoId, {
      completed: newCompleted,
    })
      .then((updatedTodo: Todo) => setTodos(prevTodos => prevTodos
        .map(todo => {
          return todo.id === updatedTodo.id
            ? { ...todo, completed: newCompleted }
            : { ...todo };
        })));
  };

  const handleAllTodoCompletedUpdate = () => {
    const newCompleted = !todos.every(todo => todo.completed);
    const updatedTodos
    = todos.map(todo => ({ ...todo, completed: newCompleted }));

    const updatePromises
    = updatedTodos.map(updatedTodo => postService.updateTodo(
      updatedTodo.id, { completed: updatedTodo.completed },
    )
      .catch(() => setErrorMessage(ErrorMessageEnum.UpdateTodoError)));

    Promise.all(updatePromises)
      .then(() => setTodos(
        prevTodos => prevTodos.map(todo => (
          { ...todo, completed: newCompleted }
        )),
      ))
      .catch(() => setErrorMessage(ErrorMessageEnum.UpdateTodoError));
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const maxId = Math.max(0, ...todos.map(todo => todo.id));
    const newTodo = {
      id: maxId + 1,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    if (!newTodo.title.trim()) {
      setErrorMessage(ErrorMessageEnum.TitleError);
      setHasMistake(!hasMistake);
    }

    if (newTodo.title.trim()) {
      postService.createTodo(newTodo)
        .then(() => setTodos([...todos, newTodo]));
    }

    setQuery('');
  };

  const handleDelete = (todoId: number) => {
    postService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ));
  };

  const handleDeleteUncomplete = () => {
    const updatedTodo = todos.filter(todo => !todo.completed);

    setTodos(updatedTodo);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const allTodoCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {'active': allTodoCompleted})}
            data-cy="ToggleAllButton"
            onClick={handleAllTodoCompletedUpdate}
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              value={query}
              placeholder="What needs to be done?"
              onChange={handleQuery}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          deleteTodo={handleDelete}
          todoCompleteUpdate={handleTodoCompletedUpdate}
          activeFilter={activeFilter}
          onTodoEdit={handleTodoEdit}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodoFilter
              todos={todos}
              activeFilter={activeFilter}
              onFilterChange={handleFilter}
              deleteUncompletedtodos={handleDeleteUncomplete}
            />
          </footer>
        )}

      </div>

      <TodoError
        errorMessage={errorMessage}
        hasMistake={hasMistake}
        setHasMistake={setHasMistake}
      />
    </div>
  );
};
