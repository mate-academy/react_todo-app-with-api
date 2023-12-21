import React, { useEffect, useMemo, useState } from 'react';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Error/Error';
import { Status } from './types/Status';
import { ErrorSpec } from './types/ErrorSpec';
import { filterTodos } from './helpers/filterTodos';
import * as TodoService from './api/todos';

const USER_ID = 12021;
const ADDED_URL = `/todos?userId=${USER_ID}`;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorSpec | null>(null);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(
    () => filterTodos(todos, status),
    [status, todos],
  );

  const uncompletedTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const areAllCompleted = uncompletedTodosCount === 0;

  useEffect(() => {
    client
      .get<Todo[]>(ADDED_URL)
      .then((todosFromServer) => {
        setTodos(todosFromServer);

        if (!todos) {
          setError(ErrorSpec.EMPTY_TITLE);
        }
      })
      .catch(() => setError(ErrorSpec.NOT_LOADED));
  }, [todos]);

  const handleStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const cleanErrors = () => {
    setError(null);
  };

  const addTodo = (title: string) => {
    setIsInputDisabled(true);
    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setError(ErrorSpec.EMPTY_TITLE);
      setIsInputDisabled(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    TodoService.createTodo(newTodo)
      .then((response) => {
        setTempTodo(response);
        setTodos([...todos, response]);
      })
      .catch(() => {
        setError(ErrorSpec.NOT_ADDED);
        setIsInputDisabled(false);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setIsInputDisabled(true);
    setLoadingTodo(filteredTodos.find((todo) => todo.id === id) || null);

    TodoService.deleteTodo(id)
      .then(() => {
        setLoadingTodo(null);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorSpec.NOT_DELETED);
        setIsInputDisabled(false);
      })
      .finally(() => {
        setIsInputDisabled(false);
      });
  };

  const clearCompleted = () => {
    filteredTodos.forEach((element) => {
      if (element.completed) {
        removeTodo(element.id);
      }
    });
    setError(null);
  };

  const updateTodo = (todo: Todo) => {
    setLoadingTodo(
      filteredTodos.find((todoToPatch) => todoToPatch.id === todo.id) || null,
    );

    TodoService.updateTodo(todo)
      .then(() => {
        setLoadingTodo(todo);
      })
      .catch(() => {
        setError(ErrorSpec.NOT_UPDATED);
        setLoadingTodo(null);
      })
      .finally(() => {
        const todosAfterUpdate = filteredTodos.map(
          todoFromPrev => (todoFromPrev.id === todo.id ? todo : todoFromPrev),
        );

        setTodos(todosAfterUpdate);
        setLoadingTodo(null);
      });
  };

  const onToggleCompleted = (todo: Todo) => {
    const todoUpdated = { ...todo, completed: !todo.completed };

    updateTodo(todoUpdated);
  };

  const onToggleAll = () => {
    const toggledTodos = todos.map((todo) => (
      { ...todo, completed: areAllCompleted ? !todo.completed : false }));

    const updatePromises = toggledTodos.map(
      updatedTodo => TodoService.updateTodo(updatedTodo),
    );

    Promise.all(updatePromises)
      .then(() => {
        setTodos(toggledTodos);
      })
      .catch(() => {
        setError(ErrorSpec.NOT_UPDATED);
      });
  };

  const handleTitleUpdate = (newTitle: string, todo: Todo) => {
    setEditingTodo(null);

    if (!newTitle) {
      removeTodo(todo.id);
    } else if (newTitle !== todo.title) {
      const updatedTodo = { ...todo, title: newTitle };

      updateTodo(updatedTodo);
    }
  };

  const onEditTodo = (todoToEdit: Todo | null) => {
    setEditingTodo(todoToEdit);
  };

  useEffect(() => {
    setLoadingTodo(
      filteredTodos.find((todo) => todo.id === loadingTodo?.id) || null,
    );
  }, [filteredTodos, loadingTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          onInput={cleanErrors}
          hasError={Boolean(error)}
          inputDisabled={isInputDisabled}
          isAllCompleted={areAllCompleted}
          onToggleAll={onToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteTodo={removeTodo}
              isProcessing={loadingTodo}
              onToggleCompleted={onToggleCompleted}
              isEditing={editingTodo}
              onEditTodo={onEditTodo}
              onSaveTodo={handleTitleUpdate}
            />
            <Footer
              onChangeStatus={handleStatus}
              status={status}
              completedCount={uncompletedTodosCount}
              onClearCompleted={clearCompleted}
              isClearNeeded={uncompletedTodosCount === filteredTodos.length}
            />
          </>
        )}
      </div>

      {error && <Errors error={error} onHideError={cleanErrors} />}
    </div>
  );
};
