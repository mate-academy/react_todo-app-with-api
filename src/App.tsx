import {
  ChangeEvent,
  useCallback,
  useEffect, useMemo, useReducer, useState,
} from 'react';
import classNames from 'classnames';
import {
  addTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Filter } from './enums/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filteredTodos } from './utils/filter';
import { INITIAL_STATE_TEMPTODO } from './constants/initial_state_newTodo';
import { USER_ID } from './constants/user_id';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './enums/Error';
import { TodoForm } from './components/TodoForm';
import { reducer } from './reducer';
import { ReducerType } from './enums/Reducer';

export const App: React.FC = () => {
  const [filter, setFilter] = useState(Filter.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, dispatch] = useReducer(reducer, INITIAL_STATE_TEMPTODO);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isCreated, setIsCreated] = useState(false);
  const [currentError, setCurrentError] = useState<Error>(Error.RESET);
  const [isArrow, setIsArrow] = useState(false);

  const isProcessing = useCallback((id: number) => {
    return !!processingIds.includes(id) || id === 0;
  }, [processingIds]);

  const onShowArrow = useMemo(() => {
    return setIsArrow(todos.every(todo => todo.completed));
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos, filter);
  }, [todos, filter]);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setCurrentError(Error.UPLOAD);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const onAdd = useCallback((todo: Todo) => {
    setIsCreated(true);

    const toAddTodo = async () => {
      try {
        const addedTodo = await addTodo(todo);

        setTodos(prev => [...prev, addedTodo]);
        dispatch({ type: ReducerType.RESET });
      } catch {
        setCurrentError(Error.ADD);
      } finally {
        setIsCreated(false);
      }
    };

    toAddTodo();
  }, [todos]);

  const onDelete = useCallback((todoIdToDelete: number) => {
    setProcessingIds(prev => [...prev, todoIdToDelete]);

    const toRemoveTodo = async () => {
      try {
        await removeTodo(todoIdToDelete);

        await getTodosFromServer();
      } catch {
        setCurrentError(Error.REMOVE);
      } finally {
        setProcessingIds(prev => prev.filter(id => id !== todoIdToDelete));
      }
    };

    toRemoveTodo();
  }, [todos]);

  const onUpdate = useCallback((todoID: number, data: Partial<Todo>) => {
    setProcessingIds(prev => [...prev, todoID]);

    const toUpdateTodo = async () => {
      try {
        await updateTodo(todoID, data);
        setProcessingIds((prev) => {
          return prev.filter(id => id !== todoID);
        });
      } catch {
        setCurrentError(Error.UPDATE);
      } finally {
        await getTodosFromServer();
      }
    };

    toUpdateTodo();
  }, [todos]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!tempTodo.title.trim()) {
      return setCurrentError(Error.TITLE);
    }

    return onAdd(tempTodo);
  }, [tempTodo]);

  const onClear = useCallback(() => {
    visibleTodos
      .forEach(todo => (todo.completed ? onDelete(todo.id) : todo));
  }, [visibleTodos]);

  const setAllTodosActiveOrCompleted = useCallback(() => {
    if (!isArrow) {
      todos.map(todo => (!todo.completed
        ? onUpdate(todo.id, { completed: true })
        : todo));

      setIsArrow(true);
    }

    if (isArrow) {
      todos.map(todo => (todo.completed
        ? onUpdate(todo.id, { completed: false })
        : todo));

      setIsArrow(false);
    }
  }, [todos, isArrow]);

  const dispatchTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ReducerType.TITLE,
      newTitle: e.target.value,
    });
  }, [tempTodo]);

  if (!USER_ID) {
    setCurrentError(Error.USER);

    return <UserWarning />;
  }

  if (currentError) {
    window.setTimeout(() => setCurrentError(Error.RESET), 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: isArrow || onShowArrow })}
              aria-label="set all todos completed"
              onClick={setAllTodosActiveOrCompleted}
            />
          )}

          <TodoForm
            handleSubmit={handleSubmit}
            isCreated={isCreated}
            value={tempTodo.title}
            inputHandler={dispatchTitle}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isProcessing={isProcessing}
          isCreated={isCreated}
          newTodo={tempTodo}
        />

        {!!todos.length && (
          <footer className="todoapp__footer">
            <TodoFilter
              filter={filter}
              setFilter={setFilter}
              onClear={onClear}
              todos={todos}
            />
          </footer>
        )}

      </div>

      {!!currentError
        && (
          <ErrorMessage
            setCurrentError={setCurrentError}
            currentError={currentError}
          />
        ) }
    </div>
  );
};
