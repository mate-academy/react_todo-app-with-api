import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  deleteTodo,
  addTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/SortType';

import { Todos } from './components/Todos/Todos';
import { Footer } from './components/Footer/Footer';
import { filter } from './components/filter/filter';
import { Form } from './components/Header-Form/Form';
import { ErrorType } from './types/ErrorType';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleNew, setTitleNew] = useState('');
  const [isSubmitingNewTodo, setIsSubmitingNewTodo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [sortField, setSortField] = useState(SortType.All);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [beingEdited, setBeingEdited] = useState<number[]>([]);
  const [beingUpdated, setBeingUpdated] = useState<number | null>(null);

  const activeInput = useRef<HTMLInputElement>(null);
  const sortedTodos = filter(todos, sortField);

  // others region
  const allTodosCompleted = todos.every(todo => todo.completed);
  const setErrorWithSetTimeout = (error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const clear = () => {
    setErrorMessage(null);
  };

  const removeTodoFromEditingList = (todo: Todo) => {
    const filteredIds = beingEdited.filter(
      currentIds => currentIds !== todo.id,
    );

    setBeingEdited(filteredIds);
  };

  const addTodoToEditingList = (todo: Todo) => {
    setBeingEdited(currentTodosId => [...currentTodosId, todo.id]);
  };

  const deleteTodoById = (id: number) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(false);

    return deleteTodo(id)
      .then(() =>
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo: Todo) => todo.id !== id),
        ),
      )
      .catch(() => {
        setErrorWithSetTimeout(ErrorType.UnableDelete);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  // region useEffect

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorWithSetTimeout(ErrorType.UnableLoad);
      });
  }, []);

  useEffect(() => {
    if (beingUpdated === null) {
      activeInput.current?.focus();
    }
  }, [todos, errorMessage, beingUpdated]);

  // handlers region
  const onDelete = (todoId: number) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(false);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorWithSetTimeout(ErrorType.UnableDelete);
        // setTodos(todos);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const onCreate = () => {
    if (!titleNew.trim()) {
      setErrorWithSetTimeout(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      title: titleNew.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    setIsSubmitingNewTodo(true);

    addTodo(newTodo)
      .then(created => {
        setTodos(currentTodos => [...currentTodos, created]);
        setTitleNew('');
      })
      .catch(() => {
        setErrorWithSetTimeout(ErrorType.UnableAdd);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitingNewTodo(false);
      });
  };

  const onUpdate = (todo: Todo, updatedTitle: string) => {
    setBeingUpdated(todo.id);

    const trimmedTitle = updatedTitle.trim();

    if (todo.title === trimmedTitle) {
      return;
    }

    if (!trimmedTitle) {
      deleteTodoById(todo.id);

      return;
    }

    addTodoToEditingList(todo);

    updateTodo(todo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currTodo => {
            if (currTodo.id === todo.id) {
              return {
                ...currTodo,
                title: trimmedTitle,
              };
            }

            return currTodo;
          }),
        );

        setBeingUpdated(null);
      })
      .catch(() => {
        setErrorWithSetTimeout(ErrorType.UnableUpdate);
      })
      .finally(() => {
        removeTodoFromEditingList(todo);
      });
  };

  // helper functions region
  const clearCompleted = () => {
    return todos.filter(todo => todo.completed).map(todo => onDelete(todo.id));
  };

  const toggleById = (updatedTodo: Todo, isCompleted: boolean) => {
    addTodoToEditingList(updatedTodo);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currTodo => {
            if (currTodo.id === updatedTodo.id) {
              return {
                ...currTodo,
                completed: isCompleted,
              };
            }

            return currTodo;
          }),
        );
      })
      .catch(() => setErrorWithSetTimeout(ErrorType.UnableUpdate))
      .finally(() => {
        removeTodoFromEditingList(updatedTodo);
      });
  };

  const makeToggleAll = () => {
    if (allTodosCompleted) {
      return todos.map(todo => toggleById(todo, false));
    } else {
      return todos.map(todo =>
        todo.completed ? todo : toggleById(todo, true),
      );
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Form
          titleNew={titleNew}
          setTitleNew={setTitleNew}
          onCreate={onCreate}
          activeInput={activeInput}
          isSubmitingNewTodo={isSubmitingNewTodo}
          allTodosCompleted={allTodosCompleted}
          hasAnyTodo={!!todos.length}
          makeToggleAll={makeToggleAll}
        />

        <Todos
          todos={sortedTodos}
          onDelete={isDeleting ? () => {} : onDelete}
          toggleById={toggleById}
          onUpdate={onUpdate}
          beingEdited={beingEdited}
          beingUpdated={beingUpdated}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={onDelete}
            isTemp={true}
            toggleById={toggleById}
            onUpdate={onUpdate}
            beingUpdated={beingUpdated}
          />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} clear={clear} />
    </div>
  );
};
