/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { ErrorTypes } from './types/ErrorTypes';
import { filterTodos } from './utils/filterTodos';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorTodo, setErrorTodo] = useState<ErrorTypes>(ErrorTypes.Empty);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [hasTitleFocus]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorTodo(ErrorTypes.LoadTodo));
  }, []);

  useEffect(() => {
    if (errorTodo === ErrorTypes.Empty) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorTodo(ErrorTypes.Empty);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorTodo]);

  const filteredTodos = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  function onAdd({ userId, title, completed }: Omit<Todo, 'id'>) {
    const currentTitleRef = titleRef.current;

    if (currentTitleRef) {
      currentTitleRef.disabled = true;
      setHasTitleFocus(true);
      setLoadingTodoIds([0]);
      setTempTodo({ ...{ userId, title, completed }, id: 0 });

      todoService
        .addTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos(currenTodos => [...currenTodos, newTodo]);

          currentTitleRef.value = '';
        })
        .catch(() => setErrorTodo(ErrorTypes.AddTodo))
        .finally(() => {
          currentTitleRef.disabled = false;
          setHasTitleFocus(false);
          setLoadingTodoIds([]);
          setTempTodo(null);
        });
    }
  }

  const onDelete = useCallback((todoIds: number[]) => {
    setHasTitleFocus(true);
    setLoadingTodoIds(todoIds);

    const deletePromises = todoIds.map(todoId => {
      return todoService
        .deleteTodos(todoId)
        .then(() => todoId)
        .catch(() => setErrorTodo(ErrorTypes.DeleteTodo));
    });

    Promise.all(deletePromises)
      .then(deletedTodoIds => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => !deletedTodoIds.includes(todo.id));
        });
      })
      .finally(() => {
        setHasTitleFocus(false);
        setLoadingTodoIds([]);
      });
  }, []);

  const onUpdate = useCallback((todosDataUpdate: Todo[]) => {
    const todoIds = todosDataUpdate.map(todo => todo.id);

    setLoadingTodoIds(todoIds);

    const updatePromises = todosDataUpdate.map(todoDataUpdate => {
      return todoService
        .updateTodo(todoDataUpdate)
        .then(updatedTodo => updatedTodo)
        .catch(() => {
          setErrorTodo(ErrorTypes.UpdateTodo);

          return null;
        });
    });

    Promise.all(updatePromises)
      .then(updatedTodos => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            const newTodo = updatedTodos.find(updatedTodo => {
              return updatedTodo?.id === todo.id;
            });

            return newTodo ?? todo;
          });
        });
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });

    return updatePromises;
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          titleRef={titleRef}
          onAdd={onAdd}
          onError={setErrorTodo}
          onUpdate={onUpdate}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loadingTodoIds={loadingTodoIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            currentFilter={currentFilter}
            onFilter={setCurrentFilter}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError error={errorTodo} onError={setErrorTodo} />
    </div>
  );
};
