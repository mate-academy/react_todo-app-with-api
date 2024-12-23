/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { TodoCreate } from './components/TodoCreate/TodoCreate';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { filterTodos } from './utils/filterTodos';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const isAllCompleted =
    todoList.length === todoList.filter(todo => todo.completed).length &&
    !!todoList.length;

  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NO_ERROR);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setDeleting] = useState(0);
  const [isUpdating, setUpdating] = useState(0);
  const [loadingBunchIds, setLoadingBunchIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const sendError = useCallback((error: ErrorType) => {
    setErrorType(error);

    const timer = setTimeout(() => {
      setErrorType(ErrorType.NO_ERROR);

      clearTimeout(timer);
    }, 3000);
  }, []);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await todoServices.getTodos();

        setTodoList(todos);
      } catch {
        sendError(ErrorType.LOAD_TODOS);
      }
    };

    getTodos();
  }, [sendError]);

  const filteredTodos = useMemo(() => {
    return filterTodos(statusFilter, todoList);
  }, [statusFilter, todoList]);

  const activeTodosCount = useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  const hasCompletedTodos = useMemo(() => {
    return todoList.length > activeTodosCount;
  }, [todoList, activeTodosCount]);

  const onClearCompleted = useCallback(async () => {
    const completedTodos = todoList.filter(todo => todo.completed);

    setLoadingBunchIds(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          await todoServices.deleteTodo(todo.id);
          setTodoList(currentTodoList =>
            currentTodoList.filter(currentTodo => currentTodo.id !== todo.id),
          );
        }),
      );
    } catch (error) {
      setErrorType(ErrorType.DELETE_TODO);
    }

    setLoadingBunchIds([]);
  }, [todoList]);

  const onDeleteTodo = useCallback(
    async (todoId: number) => {
      setDeleting(todoId);

      try {
        await todoServices.deleteTodo(todoId);

        setTodoList(currentList =>
          currentList.filter(todo => todo.id !== todoId),
        );
      } catch {
        sendError(ErrorType.DELETE_TODO);
        setDeleting(0);
        throw new Error('Error during deleting a Todo');
      }

      setDeleting(0);
    },
    [setTodoList, sendError],
  );

  const resetForm = useCallback(() => {
    setTempTodo(null);
    setSubmitting(false);
  }, []);

  const onAddTodo = useCallback(
    async (newTitle: string) => {
      const temp: Todo = {
        id: 0,
        title: newTitle,
        userId: todoServices.USER_ID,
        completed: false,
      };

      setTempTodo(temp);

      setSubmitting(true);

      try {
        const newTodo: Todo = await todoServices.createTodo({
          title: newTitle,
          userId: todoServices.USER_ID,
          completed: false,
        });

        setTodoList(currentTodoList => [...currentTodoList, newTodo]);
        setTitle('');
      } catch {
        sendError(ErrorType.ADD_TODO);
      }

      resetForm();
    },
    [sendError, resetForm],
  );

  const onUpdateTodo = useCallback(
    async (updatedTodo: Todo) => {
      setUpdating(updatedTodo.id);

      try {
        const updateTodo = await todoServices.updateTodos(updatedTodo);

        setTodoList(
          currentTodoList =>
            currentTodoList.map(todo => {
              if (todo.id === updatedTodo.id) {
                return updateTodo;
              }

              return todo;
            }) as Todo[],
        );
      } catch {
        sendError(ErrorType.UPDATE_TODO);
        setUpdating(0);
        throw new Error('Error during updating a Todo');
      }

      setUpdating(0);
    },
    [sendError],
  );

  const onCompletingAll = useCallback(
    async (status: boolean) => {
      const changedTodos = todoList.filter(todo => todo.completed !== status);

      setLoadingBunchIds(changedTodos.map(todo => todo.id));

      try {
        await Promise.all(
          changedTodos.map(todo =>
            onUpdateTodo({ ...todo, completed: status }),
          ),
        );
      } catch (error) {
        setErrorType(ErrorType.UPDATE_TODO);
      }

      setLoadingBunchIds([]);
    },
    [onUpdateTodo, todoList],
  );

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoCreate
          todoList={todoList}
          onAddTodo={onAddTodo}
          sendError={sendError}
          isSubmitting={isSubmitting}
          title={title}
          setTitle={setTitle}
          onCompletingAll={onCompletingAll}
          isAllCompleted={isAllCompleted}
        />

        {!!todoList.length && (
          <>
            <TodoList
              todoList={filteredTodos}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
              onUpdateTodo={onUpdateTodo}
              loadingBunchIds={loadingBunchIds}
            />
            <TodoFooter
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              countActiveTodos={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              clearCompleted={onClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification errorType={errorType} setErrorType={setErrorType} />
    </div>
  );
};
