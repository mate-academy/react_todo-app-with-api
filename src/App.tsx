/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import * as todoAPI from './api/todos';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todos } from './components/Todos';

import { Todo } from './types/Todo';
import { TodoFilterStatus } from './types/TodoFilterStatus';
import { TypeError } from './types/TypeError';

import { TodoFilter } from './utils/filterTodos/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const refQuery = useRef<HTMLInputElement>(null);
  const refEditQuery = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToCreate, setTodoToCreate] = useState<Todo | null>(null);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [error, setError] = useState<TypeError>(TypeError.None);
  const [todoFilterState, setTodoFilterState] = useState<TodoFilterStatus>(
    TodoFilterStatus.All,
  );

  const filteredTodos = TodoFilter.Filter(
    todos,
    TodoFilter.FilterByComplete(todoFilterState),
  );

  //#region supportFunctions
  function getCompletedTodo() {
    return todos.reduce((prev, todo) => (todo.completed ? prev + 1 : prev), 0);
  }

  function closeErrorMessage() {
    setTimeout(() => setError(TypeError.None), 3000);
  }

  //#endregion

  //#region TodoHandlers

  const handleToggleComplete = (id: number, completed: boolean) => {
    setProcessingTodoIds(prevIds => [...prevIds, id]);
    todoAPI
      .patchTodoCompleted(id, !completed)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (todo.id === id) {
              return { ...todo, completed: !todo.completed };
            }

            return { ...todo };
          }),
        );
      })
      .catch(() => setError(TypeError.UnableUpdateTodo))
      .finally(() => {
        setProcessingTodoIds(prevIds =>
          prevIds.filter(previousId => previousId !== id),
        );
        closeErrorMessage();
      });
  };

  const handleDeleteClick = (id: number, onSuccess?: () => void) => {
    setProcessingTodoIds(prevIds => [...prevIds, id]);

    todoAPI
      .deleteTodo(id)
      .then(() => {
        setTodos(previousTodos => previousTodos.filter(todo => todo.id !== id));
        onSuccess?.();
      })
      .catch(() => {
        setError(TypeError.UnableDeleteTodo);
      })
      .finally(() => {
        closeErrorMessage();

        setProcessingTodoIds(prevIds =>
          prevIds.filter(deletingId => deletingId !== id),
        );
      });
  };

  const handleEditClick = (id: number) =>
    setTodoToEdit(todos.find(todo => todo.id === id) || null);

  const handleAnimations = (id: number) => !!processingTodoIds.includes(id);

  const handleEditCancel = () => setTodoToEdit(null);

  const handleEditSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    let newTitle = '';

    if (refEditQuery.current) {
      newTitle = refEditQuery.current.value.trim();
    }

    if (!todoToEdit) {
      return;
    }

    if (newTitle === todoToEdit.title) {
      handleEditCancel();

      return;
    }

    if (newTitle === '') {
      handleDeleteClick(todoToEdit.id, handleEditCancel);

      return;
    }

    setProcessingTodoIds(prevIds => [...prevIds, todoToEdit.id]);

    todoAPI
      .patchTodoTitle(todoToEdit.id, newTitle)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (todo.id === todoToEdit.id) {
              return { ...todo, title: newTitle };
            }

            return { ...todo };
          }),
        );
        setTodoToEdit(null);
      })
      .catch(() => {
        setError(TypeError.UnableUpdateTodo);
        refEditQuery.current?.focus();
      })
      .finally(() => {
        closeErrorMessage();
        setProcessingTodoIds(prevIds =>
          prevIds.filter(todo => {
            if (!todoToEdit) {
              return true;
            }

            return todo !== todoToEdit.id;
          }),
        );
      });
  };

  //#endregion

  // #region HeaderHandlers

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = refQuery.current?.value.trim() || '';

    if (newTitle.length > 0) {
      const newTodo = {
        userId: todoAPI.USER_ID,
        title: newTitle,
        completed: false,
      };

      todoAPI
        .postTodo(newTodo)
        .then(createdTodo => {
          setTodos([...todos, createdTodo]);
          if (refQuery.current) {
            refQuery.current.value = '';
          }
        })
        .catch(() => {
          setError(TypeError.UnableAddTodo);
        })
        .finally(() => {
          setTodoToCreate(null);
          closeErrorMessage();
        });

      setTodoToCreate({ ...newTodo, id: 0 });
    } else {
      setError(TypeError.TitleEmpty);
      closeErrorMessage();
    }
  };

  const handleToggleAllTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodos.length > 0) {
      activeTodos.forEach(todo =>
        handleToggleComplete(todo.id, todo.completed),
      );
    } else {
      todos.forEach(todo => handleToggleComplete(todo.id, todo.completed));
    }
  };

  //#endregion

  // #region FooterHandels

  const handleSetTodoFilter = (filterStatus: TodoFilterStatus) => {
    setTodoFilterState(filterStatus);
  };

  const handleDeleteCompletedTodos = () => {
    todoAPI
      .getCompletedTodos(todoAPI.USER_ID)
      .then(completedTodos => {
        completedTodos.forEach(({ id }) => {
          handleDeleteClick(id);
        });
      })
      .catch(() => setError(TypeError.UnableDeleteTodo))
      .finally(closeErrorMessage);
  };

  // #endregion

  //#region useEffect

  useEffect(() => {
    todoAPI
      .getTodos(todoAPI.USER_ID)
      .then(newTodos => {
        setTodos(newTodos);
      })
      .catch(() => {
        setError(TypeError.UnableLoadTodos);
      })
      .finally(closeErrorMessage);
  }, []);

  useEffect(() => {
    refQuery.current?.focus();
  }, [todos, todoToCreate]);

  useEffect(() => {
    if (refEditQuery.current) {
      refEditQuery.current.value = todoToEdit?.title || '';
      refEditQuery.current.focus();
    }
  }, [todoToEdit]);

  // #endregion

  if (!todoAPI.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          refQuery={refQuery}
          isAllTodoDone={todos.length === getCompletedTodo()}
          isCreatingTodo={!!todoToCreate}
          isExistTodo={!!todos.length}
          onSubmitTodo={handleSubmit}
          onToggleAllTodo={handleToggleAllTodos}
        />

        <Todos
          todos={filteredTodos}
          todoToCreate={todoToCreate}
          refEditing={refEditQuery}
          todoToEdit={todoToEdit}
          checkTodoProcessing={handleAnimations}
          onToggleComplete={handleToggleComplete}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
          onEditSubmit={handleEditSubmit}
          onEditCancel={handleEditCancel}
        />

        <Footer
          totalTodos={todos.length}
          completedTodos={getCompletedTodo()}
          selectedFilter={todoFilterState}
          setTodoFilter={handleSetTodoFilter}
          deleteCompletedTodos={handleDeleteCompletedTodos}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorType={error} />
    </div>
  );
};
