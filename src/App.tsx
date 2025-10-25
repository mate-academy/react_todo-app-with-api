/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoElement } from './components/TodoElement/TodoElement';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const todoInput = useRef<HTMLInputElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [showedTodos, setShowedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.NoError,
  );
  const [newTodoId, setNewTodoId] = useState<number | null>(null);
  const [editedTitleTodoId, setTitleEditedTodoId] = useState<number | null>(
    null,
  );
  const [editedStatusTodoId, setEditedStatusTodoId] = useState<number | null>(
    null,
  );
  const [editedTitle, setEditedTitle] = useState<string>('');

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const itemsLeft = activeTodos.length;
  let isToggledAll = completedTodos.length === todos.length;

  const handleInputFocus = () => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  };

  const handleEditedTitleFocus = () => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  };

  const handleFocus = () => {
    if (editedTitleTodoId) {
      handleEditedTitleFocus();
    } else {
      handleInputFocus();
    }
  };

  useEffect(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        setShowedTodos(activeTodos);
        break;
      case FilterStatus.Completed:
        setShowedTodos(completedTodos);
        break;
      case FilterStatus.All:
      default:
        setShowedTodos(todos);
        break;
    }

    handleFocus();
  }, [filterStatus, todos]);

  const timerId = useRef(0);

  const hideError = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorType.NoError);
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(result => {
        setTodos(result);
        setShowedTodos(result);
      })
      .catch(error => {
        setErrorMessage(ErrorType.LoadTodosError);
        hideError();
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setIsRendered(true);
      });
  }, []);

  const handleTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(ErrorType.NoError);

    if (title.trim().length > 0) {
      setLoading(true);
      setNewTodoId(0);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      let newTodo: Todo | null = null;

      addTodo(title.trim())
        .then((response: Todo) => {
          newTodo = response;
          setNewTodoId(response.id);
        })
        .catch(error => {
          setErrorMessage(ErrorType.AddTodoError);
          hideError();
          throw error;
        })
        .finally(() => {
          setLoading(false);
          if (newTodo) {
            setTodos([...todos, newTodo]);
            setTitle('');
            setNewTodoId(null);
          }

          setTempTodo(null);
        });
    } else {
      setErrorMessage(ErrorType.EmptyTodoTitleError);
      hideError();
    }
  };

  const handleTitleChange = (value: string) => {
    setErrorMessage(ErrorType.NoError);
    setTitle(value);
  };

  const handleTodoDelete = (todo: Todo) => {
    setErrorMessage(ErrorType.NoError);
    setLoading(true);
    setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
    setNewTodoId(todo.id);

    removeTodo(todo.id)
      .catch(error => {
        setTodos(todos);
        setErrorMessage(ErrorType.DeleteTodoError);
        hideError();
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setNewTodoId(null);
        setTimeout(() => {
          handleFocus();
        }, 0);
      });
  };

  const collectFailedIds = (
    results: PromiseSettledResult<unknown>[],
    ids: number[],
  ): number[] => {
    return results
      .map((result, index) => ({
        result,
        id: ids[index],
      }))
      .filter(item => item.result.status === 'rejected')
      .map(item => item.id);
  };

  const handleCompletedDelete = () => {
    setErrorMessage(ErrorType.NoError);
    setLoading(true);
    const completedIds = completedTodos.map(todo => todo.id);
    const prevTodos = todos;

    Promise.allSettled(completedIds.map(id => removeTodo(id)))
      .then(results => {
        // Check which deletions failed
        const failedIds = collectFailedIds(results, completedIds);

        if (failedIds.length > 0) {
          setErrorMessage(ErrorType.DeleteTodoError);
        }

        setTodos(
          prevTodos.filter(
            todo =>
              !completedIds.includes(todo.id) || failedIds.includes(todo.id),
          ),
        );
        hideError();
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          handleFocus();
        }, 0);
      });
  };

  useEffect(() => {
    handleFocus();
  }, [errorMessage]);

  useEffect(() => {
    handleEditedTitleFocus();
  }, [editedTitleTodoId]);

  const handleUpdate = (updatedTodo: Todo) => {
    setLoading(true);
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );

    return updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorType.UpdateTodoError);
        setTodos(todos);
        handleFocus();
        hideError();
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMakeAllCompleted = () => {
    setErrorMessage(ErrorType.NoError);
    setLoading(true);
    const todosToUpdate = isToggledAll ? todos : activeTodos;
    const updatedIds = todosToUpdate.map(todo => todo.id);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: !todo.completed }),
      ),
    )
      .then(results => {
        const failedIds = collectFailedIds(results, updatedIds);

        if (failedIds.length > 0) {
          setErrorMessage(ErrorType.UpdateTodoError);
        }

        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (updatedIds.includes(todo.id) && !failedIds.includes(todo.id)) {
              return { ...todo, completed: !todo.completed };
            }

            return todo;
          }),
        );
      })
      .finally(() => {
        isToggledAll = completedTodos.length === todos.length;
        setLoading(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoInput={todoInput}
          title={title}
          onTodoSubmit={handleTodoSubmit}
          onTitleChange={handleTitleChange}
          loading={loading}
          onMakeAllCompleted={handleMakeAllCompleted}
          isToggledAll={isToggledAll}
          isRendered={isRendered}
          todos={todos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          <TransitionGroup>
            {showedTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoElement
                  key={todo.id}
                  todo={todo}
                  loading={loading}
                  onTodoDelete={handleTodoDelete}
                  newTodoId={newTodoId}
                  editedTitleTodoId={editedTitleTodoId}
                  setEditedTitleTodoId={setTitleEditedTodoId}
                  editedStatusTodoId={editedStatusTodoId}
                  setEditedStatusTodoId={setEditedStatusTodoId}
                  onUpdate={handleUpdate}
                  titleInput={titleInput}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoElement
                  key={0}
                  todo={tempTodo}
                  loading={loading}
                  onTodoDelete={handleTodoDelete}
                  newTodoId={newTodoId}
                  editedTitleTodoId={editedTitleTodoId}
                  setEditedTitleTodoId={setTitleEditedTodoId}
                  editedStatusTodoId={editedStatusTodoId}
                  setEditedStatusTodoId={setEditedStatusTodoId}
                  onUpdate={handleUpdate}
                  titleInput={titleInput}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodos}
            onCompletedDelete={handleCompletedDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error
        errorMessage={errorMessage}
        onRemoveError={() => setErrorMessage(ErrorType.NoError)}
      />
    </div>
  );
};
