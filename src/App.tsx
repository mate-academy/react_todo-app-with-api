/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region Imports
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodos,
  patchTodo,
} from './api/todos';
import { Todo, TodoWithoutId } from './types/Todo';
import { TodoFilter } from './enums/TodoFilter.enum';
import { ErrorMessages } from './enums/ErrorMessages.enum';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TempTods } from './components/TempTodos';
import { ErrorNotification } from './components/ErrorNotification';
import classNames from 'classnames';

//#endregion

export const App: React.FC = () => {
  //#region States
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterStatus, setFilterStatus] = useState<TodoFilter>(TodoFilter.All);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const [disable, setDisable] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  //#endregion

  //#region Logic
  const addTodos = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = title.trim();

    if (trimmed === '') {
      setErrorMessage(ErrorMessages.TitleEmpty);

      return;
    }

    setErrorMessage('');

    setTempTodo({
      id: 0,
      title: trimmed,
      userId: USER_ID,
      completed: false,
    });

    //TODO: implement interface for TodoItem and use it instead of any
    const newTodo: TodoWithoutId = {
      title: trimmed,
      userId: USER_ID,
      completed: false,
    };

    setDisable(true);

    postTodos(newTodo)
      .then(response => {
        setTodos([...todos, response]);
        setTempTodo(null);
        setDisable(false);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToAddTodo);
        setTempTodo(null);
        setDisable(false);
        // setTitle('');
      });
  };

  const deleteTodos = (id: number) => {
    setDeleting([...deleting, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setDeleting(deleting.filter(todo => todo !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setDeleting(deleting.filter(todo => todo !== id));
        setErrorMessage(ErrorMessages.UnableToDeleteTodo);
      });
  };

  const resolveTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed === true);
    const Promises = completedTodos.map(todo => deleteTodos(todo.id));

    Promise.allSettled(Promises);
  };

  const toggleAll = () => {
    const notCompletedTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (notCompletedTodos.length > 0) {
      const completePromises = notCompletedTodos.map(todo =>
        patchTodo(todo.id, { completed: true }),
      );

      setUpdatingIds(notCompletedTodos.map(todo => todo.id));

      Promise.allSettled(completePromises).then(() => {
        setTodos(
          todos.map(todo => {
            if (!todo.completed) {
              return { ...todo, completed: true };
            } else {
              return todo;
            }
          }),
        );
        setUpdatingIds([]);
      });
    } else {
      const notCompletedPromises = completedTodos.map(todo =>
        patchTodo(todo.id, { completed: false }),
      );

      setUpdatingIds(completedTodos.map(todo => todo.id));

      Promise.allSettled(notCompletedPromises).then(() => {
        setTodos(
          todos.map(todo => {
            if (todo.completed) {
              return { ...todo, completed: false };
            } else {
              return todo;
            }
          }),
        );
        setUpdatingIds([]);
      });
    }
  };

  const toggleTodoStatus = (id: number, completed: boolean) => {
    setUpdatingIds([id]);

    patchTodo(id, { completed: !completed }) //пише що не може знайти функцію patchTodo
      .then(() => {
        setTodos(
          todos.map(todo => {
            if (todo.id === id) {
              return { ...todo, completed: !completed };
            } else {
              return todo;
            }
          }),
        );
        setUpdatingIds([]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToUploadTodo);
        setUpdatingIds([]);
      });
  };

  const onRename = (id: number, newTitle: string) => {
    setUpdatingIds([id]);
    patchTodo(id, { title: newTitle.trim() })
      .then(() => {
        setTodos(
          todos.map(todo => {
            if (todo.id === id) {
              return { ...todo, title: newTitle.trim() };
            } else {
              return todo;
            }
          }),
        ),
          setEditingId(null);
        setUpdatingIds([]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToUploadTodo);
        setUpdatingIds([]);
      });
  };

  //#endregion

  //#region useEffects
  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.UnableToLoadTodos));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  //#endregion

  //filtering logic
  const visibleTodos = todos.filter(todo =>
    filterStatus === TodoFilter.Active
      ? !todo.completed
      : filterStatus === TodoFilter.Completed
        ? todo.completed
        : filterStatus === TodoFilter.All,
  );

  //#region focus
  useEffect(() => {
    if (inputRef.current !== null && !disable) {
      inputRef.current.focus();
    }
  }, [disable]);

  useEffect(() => {
    if (editInputRef.current !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTitle]);
  //#endregion
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have active class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodos}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={disable}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <div>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                visibleTodos={visibleTodos}
                deleting={deleting}
                onDelete={deleteTodos}
                toggleTodoStatus={toggleTodoStatus}
                updatingIds={updatingIds}
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingId={setEditingId}
                setEditingTitle={setEditingTitle}
                onRename={onRename}
                editInputRef={editInputRef}
              />
              {tempTodo !== null && <TempTods tempTodo={tempTodo} />}
            </section>
            <Footer
              todos={todos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              resolveTodos={resolveTodos}
            />
          </div>
        )}
        <ErrorNotification
          onClose={() => setErrorMessage('')}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
