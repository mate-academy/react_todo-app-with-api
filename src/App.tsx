import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as todosService from './api/todos';

import { UserWarning } from './components/UserWarning/UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import type { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 12039;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState(StatusFilter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const timerId = useRef<NodeJS.Timeout>();
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const showErrorNotification = useCallback((error: ErrorMessage): void => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setErrorMessage(error);
    timerId.current = setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const hideErrorNotification = useCallback(
    (): void => setErrorMessage(null),
    [],
  );

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showErrorNotification(ErrorMessage.LOAD_ERROR));
  }, [showErrorNotification]);

  const todosToRender = useMemo((): Todo[] => todos.filter(todo => {
    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        return !todo.completed;

      case StatusFilter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  }), [todos, statusFilter]);

  const addTodo = useCallback((title: string): Promise<void> => {
    setTempTodo({
      title,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    return todosService.createTodo(title, USER_ID)
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(() => {
        showErrorNotification(ErrorMessage.ADD_ERROR);
        throw new Error();
      });
  }, [showErrorNotification]);

  const deleteTodo = useCallback((id: number): Promise<number | void> => {
    setProcessingTodoIds(currentIds => [...currentIds, id]);

    return todosService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showErrorNotification(ErrorMessage.DELETE_ERROR);
      })
      .finally(() => {
        setProcessingTodoIds(
          currentIds => currentIds.filter(proccesingId => proccesingId !== id),
        );
      });
  }, [showErrorNotification]);

  const updateTodo = useCallback((
    id: number,
    dataToUpdate: Partial<Todo>,
  ): Promise<void> => {
    setProcessingTodoIds(currentIds => [...currentIds, id]);

    return todosService.updateTodo(id, dataToUpdate)
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => {
          return todo.id === updatedTodo.id
            ? updatedTodo
            : todo;
        }));
      })
      .catch(() => {
        showErrorNotification(ErrorMessage.UPDATE_ERROR);
        if (dataToUpdate.title) {
          throw new Error();
        }
      })
      .finally(() => {
        setProcessingTodoIds((currentIds) => {
          return currentIds.filter(proccesingId => proccesingId !== id);
        });
      });
  }, [showErrorNotification]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          setTempTodo={setTempTodo}
          showErrorNotification={showErrorNotification}
          todos={todos}
          changeTodoStatus={updateTodo}
          inputRef={newTodoInputRef}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={todosToRender}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
              processingTodoIds={processingTodoIds}
              onUpdate={updateTodo}
              newTodoInputRef={newTodoInputRef}
            />

            <Footer
              todos={todos}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              deleteTodo={deleteTodo}
              newTodoInputRef={newTodoInputRef}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={hideErrorNotification}
      />
    </div>
  );
};
