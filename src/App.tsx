/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  editTodos,
  getTodos,
  postTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { Filters } from './types/Filters';
import { TodoItem } from './TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addTodoTitle, setAddTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterSelected, setFilterSelected] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<Set<number>>(
    new Set(),
  );
  const [clearingCompletedIds, setClearingCompletedIds] = useState<Set<number>>(
    new Set(),
  );

  const [allCompleted, setAllCompleted] = useState(false);

  const ref = useRef<HTMLInputElement | null>(null);

  const updateTodos = (todoId, title) => {
    // prettier-ignore
    setTodos(prevState =>
      title === null
        ? prevState.filter(todo => todo.id !== todoId)
        : prevState.map(todo => todoId === todo.id
          ? { ...todo, title: title } : todo,),
    );
  };

  const handleDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await deleteTodos(todoId);
      updateTodos(todoId, null);
      ref.current.focus();
    } catch (Error) {
      setError('Unable to delete a todo');
    }
  };

  const updateStatus = (todoId, completed) => {
    // prettier-ignore
    setTodos(prevState =>
      prevState.map(todo => todoId === todo.id
        ? { ...todo, completed: completed } : todo,),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = addTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    setIsSubmitting(true);
    try {
      const newTodo = {
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      };
      const createdTodo = await postTodos(newTodo);

      setTodos(prevState => [...prevState, createdTodo]);
      setTempTodo(null);
      setAddTodoTitle('');
    } catch {
      setError('Unable to add a todo');

      setTempTodo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatus = async (todoId, completed) => {
    setUpdatingStatusIds(prev => new Set(prev.add(todoId)));
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    const updatedTodo = {
      title: todoToUpdate.title,
      completed: !completed,
      todoId,
    };

    try {
      await editTodos(updatedTodo);
      updateStatus(todoId, !completed);
    } catch (Error) {
      setError('Unable to update a todo');
    } finally {
      setUpdatingStatusIds(prev => {
        const updated = new Set(prev);

        updated.delete(todoId);

        return updated;
      });
    }
  };

  const handleToggleAll = async () => {
    const IsAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== !allCompleted,
    );

    setIsSubmitting(true);

    try {
      const updatePromises = todosToUpdate.map(async todo => {
        setUpdatingStatusIds(prev => new Set(prev.add(todo.id)));
        await editTodos({
          title: todo.title,
          completed: !IsAllCompleted,
          todoId: todo.id,
        });
        updateStatus(todo.id, !IsAllCompleted);
        setUpdatingStatusIds(prev => {
          const updated = new Set(prev);

          updated.delete(todo.id);

          return updated;
        });
      });

      await Promise.all(updatePromises);
    } catch (Error) {
      setError('Unable to update a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setClearingCompletedIds(new Set(completedTodos.map(todo => todo.id)));
    try {
      await Promise.all(
        completedTodos.map(async todo => {
          await handleDelete(todo.id);
        }),
      );
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setClearingCompletedIds(new Set());
    }
  };

  const filteredTodos = () => {
    if (filterSelected === Filters.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filterSelected === Filters.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const IsAllCompleted = todos.every(todo => todo.completed);

    setAllCompleted(IsAllCompleted);
  }, [todos]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!isSubmitting && ref.current) {
      ref.current.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              disabled={isSubmitting}
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={() => handleToggleAll()}
            />
          )}
          <form
            onSubmit={event => {
              handleSubmit(event);
            }}
          >
            <input
              ref={ref}
              disabled={isSubmitting}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addTodoTitle}
              onChange={event => {
                setAddTodoTitle(event.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos()}
          deletingTodoId={deletingTodoId}
          updateTodos={updateTodos}
          updateStatus={updateStatus}
          setTodos={setTodos}
          setError={setError}
          handleDelete={handleDelete}
          handleStatus={handleStatus}
          updatingStatusIds={updatingStatusIds}
          clearingCompletedIds={clearingCompletedIds}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            todos={[]}
            updateTodos={() => {}}
            setTodos={() => {}}
            setError={setError}
            handleDelete={() => {}}
            tempTodo={tempTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            handleDelete={handleDelete}
            clearingCompletedIds={clearingCompletedIds}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
