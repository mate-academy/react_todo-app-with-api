/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { FilterStatus } from './types/FilterStatus';
import * as todoService from './api/todos';
import { initialState, todoReducer } from './store/todoReducer';
import { useError } from './components/ErrorContext/ErrorContext';

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [selectFilterStatus, setSelectFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const { setError } = useError();
  const headerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(todos => dispatch({ type: 'SET_TODOS', payload: todos }))
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(
    () =>
      state.todos.filter(todo => {
        switch (selectFilterStatus) {
          case FilterStatus.Active:
            return !todo.completed;
          case FilterStatus.Completed:
            return todo.completed;
          default:
            return true;
        }
      }),
    [selectFilterStatus, state.todos],
  );

  useEffect(() => {
    if (!state.loadingState.isLoading) {
      headerInputRef.current?.focus();
    }
  }, [state.loadingState.isLoading]);

  const addTodo = useCallback(
    async (todo: Omit<Todo, 'id' | 'userId'>): Promise<boolean> => {
      dispatch({ type: 'SET_TEMP_TODO', payload: todo });

      try {
        const newTodo = await todoService.createTodo(todo);

        dispatch({ type: 'ADD_TODO', payload: newTodo });

        return true;
      } catch {
        setError('Unable to add a todo');

        return false;
      } finally {
        dispatch({ type: 'CLEAR_TEMP_TODO' });
      }
    },
    [],
  );

  const deleteTodo = useCallback(async (todoId: number): Promise<boolean> => {
    dispatch({
      type: 'TOGGLE_LOADING',
      payload: { key: 'deletingTodos', todoId },
    });

    try {
      await todoService.deleteTodo(todoId);

      dispatch({ type: 'DELETE_TODO', payload: todoId });

      return true;
    } catch {
      setError('Unable to delete a todo');

      return false;
    } finally {
      dispatch({
        type: 'TOGGLE_LOADING',
        payload: { key: 'deletingTodos', todoId },
      });
    }
  }, []);

  const deleteCompletedTodos = useCallback(
    async (completedIds: number[]) => {
      const deletionStatuses = await Promise.allSettled(
        completedIds.map(id => deleteTodo(id)),
      );

      if (deletionStatuses.some(status => status.status === 'rejected')) {
        setError('Unable to delete completed todos');
      }
    },
    [deleteTodo],
  );

  const updateTodo = useCallback(
    async (updatedTodo: Todo): Promise<boolean> => {
      const { id: todoId } = updatedTodo;

      dispatch({
        type: 'TOGGLE_LOADING',
        payload: { key: 'updatingTodos', todoId },
      });

      try {
        const newTodo = await todoService.updateTodo(updatedTodo);

        dispatch({ type: 'UPDATE_TODO', payload: newTodo });

        return true;
      } catch {
        setError('Unable to update a todo');

        return false;
      } finally {
        dispatch({
          type: 'TOGGLE_LOADING',
          payload: { key: 'updatingTodos', todoId },
        });
      }
    },
    [],
  );

  const handleToggleAll = useCallback(async () => {
    const areAllTodosCompleted = state.todos.every(todo => todo.completed);

    const todosToUpdate = areAllTodosCompleted
      ? state.todos
      : state.todos.filter(todo => !todo.completed);

    const updateStatuses = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({
          ...todo,
          completed: !todo.completed,
        }),
      ),
    );

    if (updateStatuses.some(status => status.status === 'rejected')) {
      setError('Unable to update a todo');
    }
  }, [state.todos, updateTodo]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={state.todos}
          addTodo={addTodo}
          handleToggleAll={handleToggleAll}
          headerInputRef={headerInputRef}
          isAdding={state.loadingState.isAdding}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={state.tempTodo}
          isAdding={state.loadingState.isAdding}
          deletingTodos={state.loadingState.deletingTodos}
          updatingTodos={state.loadingState.updatingTodos}
        />

        {/* Hide the footer if there are no todos */}
        {state.todos.length > 0 && (
          <TodoFooter
            todos={state.todos}
            selectedStatus={selectFilterStatus}
            setSelectedStatus={setSelectFilterStatus}
            onClearCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification />
    </div>
  );
};
