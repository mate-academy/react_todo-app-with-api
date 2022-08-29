/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { DispatchContext } from './components/StateContext';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/Filter';
import { Todo, UpdateTodoframent } from './types/Todo';
import { User } from './types/User';
import { useHideError, useShowError } from './utils/hooks';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterTypes.All);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const user = useContext(AuthContext) as User;
  const dispatch = useContext(DispatchContext);

  const showError = useShowError();
  const hideError = useHideError();

  useEffect(() => {
    getTodos(user.id)
      .then(loadedTodos => setTodos(loadedTodos));
  }, []);

  useEffect(() => {
    const allTodosCompleted = (
      todos.length && todos.every(todo => todo.completed)
    );

    setIsAllCompleted(false);

    if (allTodosCompleted) {
      setIsAllCompleted(true);
    }
  }, [todos]);

  const onDelete = useCallback((todoId: number) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== todoId);
    });
  }, []);

  const onAdd = useCallback((newTodo: Todo) => {
    setTodos((prev) => {
      if (prev) {
        return [...prev, newTodo];
      }

      return prev;
    });
  }, []);

  const onUpdate = useCallback((todoId: number, data: UpdateTodoframent) => {
    setTodos((prev) => {
      return prev.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      });
    });
  }, []);

  const toggleCompletedAll = (isCompleted: boolean) => {
    hideError();

    todos.forEach(todo => {
      const data = { completed: isCompleted };

      if (todo.completed !== isCompleted) {
        dispatch({ type: 'startSave', peyload: String(todo.id) });

        updateTodo(todo.id, data)
          .then(res => {
            if (!res) {
              throw Error();
            }

            onUpdate(todo.id, data);
          })
          .catch(() => showError('Unable to update a todo'))
          .finally(() => dispatch(
            { type: 'finishSave', peyload: String(todo.id) },
          ));
      }
    });
  };

  const onToggleCompletedAll = useCallback(() => {
    setIsAllCompleted((prev) => {
      toggleCompletedAll(!prev);

      return !prev;
    });
  }, [todos]);

  const onClearCompleted = useCallback(() => {
    hideError();

    todos.forEach(todo => {
      if (todo.completed) {
        dispatch({ type: 'startSave', peyload: String(todo.id) });
        deleteTodo(todo.id)
          .then(res => {
            if (!res) {
              throw Error();
            }

            onDelete(todo.id);
          })
          .catch(() => showError('Unable to delete a todo'))
          .finally(() => dispatch(
            { type: 'finishSave', peyload: String(todo.id) },
          ));
      }
    });
  }, [todos]);

  const onFilterTypeChange = useCallback((type: FilterTypes) => {
    if (filterType !== type) {
      setFilterType(type);
    }
  }, [filterType]);

  const itemsLeft = useMemo(() => {
    return todos.reduce((completedCount, { completed }) => (
      completed ? completedCount : completedCount + 1
    ), 0);
  }, [todos]);

  const complitedTodos = useMemo(() => {
    return todos.length - itemsLeft;
  }, [itemsLeft, todos]);

  const filteredTodos = useMemo(() => {
    return todos?.filter(todo => {
      switch (filterType) {
        case FilterTypes.Active:
          return !todo.completed;

        case FilterTypes.Completed:
          return todo.completed;

        default:
          return true;
      }
    }) || null;
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={onAdd}
          onToggleCompletedAll={onToggleCompletedAll}
          isAllCompleted={isAllCompleted}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            onFilterTypeChange={onFilterTypeChange}
            filterType={filterType}
            complitedTodos={complitedTodos}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
