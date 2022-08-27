/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { DispatchContext } from './components/StateContext';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/Filter';
import { Maybe } from './types/Maybe';
import { Todo, UpdateTodoframent } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const user = useContext(AuthContext) as User;

  const [todos, setTodos] = useState<Maybe<Todo[]>>(null);
  const [filterType, setFilterType] = useState(FilterTypes.All);

  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    getTodos(user.id)
      .then(loadedTodos => setTodos(loadedTodos));
  }, []);

  const onDelete = useCallback((todoId: number) => {
    setTodos((prev) => {
      return prev?.filter((todo) => todo.id !== todoId) || prev;
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
      return prev?.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      }) || prev;
    });
  }, []);

  const toggleCompletedAll = useCallback((isAllCompleted: boolean) => {
    todos?.forEach(todo => {
      const data = { completed: isAllCompleted };

      dispatch({ type: 'startSave', peyload: '' });

      updateTodo(todo.id, data)
        .then(res => {
          if (res) {
            onUpdate(todo.id, data);
          }
        })
        .finally(() => dispatch({ type: 'finishSave', peyload: '' }));
    });
  }, [todos]);

  const onFilterTypeChange = useCallback((type: FilterTypes) => {
    if (filterType !== type) {
      setFilterType(type);
    }
  }, [filterType]);

  const itemsLeft = useMemo(() => {
    return todos?.reduce((completedCount, { completed }) => (
      completed ? completedCount : completedCount + 1
    ), 0) || 0;
  }, [todos]);

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
        <Header onAdd={onAdd} toggleCompletedAll={toggleCompletedAll} />

        {todos && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />

            <Footer
              itemsLeft={itemsLeft}
              onFilterTypeChange={onFilterTypeChange}
              filterType={filterType}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
