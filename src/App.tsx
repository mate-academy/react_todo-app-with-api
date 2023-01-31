/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import {
  getTodos,
  createTodo,
  removeTodo,
  changeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { FilterCondition, ErorrMessage } from './types/enums';
import { Header } from './components/Main/Header';
import { TodoList } from './components/Main/TodoList';
import { Footer } from './components/Main/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [filterCondition, setFilterCondition] = useState(FilterCondition.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [tempNewTask, setTempNewTask] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  const getSelected = useCallback(
    (allTodos: Todo[]): Todo[] => {
      switch (filterCondition) {
        case FilterCondition.COMPLETED:
          return allTodos.filter(item => item.completed === true);

        case FilterCondition.ACTIVE:
          return allTodos.filter(item => item.completed === false);

        case FilterCondition.ALL:
        default:
          return allTodos;
      }
    }, [filterCondition],
  );

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    const fullTodoData = { ...todoData, userId: user?.id };

    try {
      const temporaryTodo = {
        ...todoData,
        id: 0,
      };

      setTempNewTask(temporaryTodo);

      setIsAdding(true);
      const newTodo = await createTodo(fullTodoData);

      setTodosList(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setErrorText(ErorrMessage.ON_ADD);
    } finally {
      setTempNewTask(null);
      setIsAdding(false);
    }
  }, [user?.id]);

  const deleteTodo = useCallback(async (idToDelete: number) => {
    try {
      setDeletingTodoIds(curr => [...curr, idToDelete]);

      await removeTodo(idToDelete);

      setTodosList((currentTodos: Todo[]) => currentTodos
        .filter(task => task.id !== idToDelete));
    } catch {
      setIsError(true);
      setErrorText(ErorrMessage.ON_DELETE);
    } finally {
      setDeletingTodoIds(currId => currId.filter(id => id !== idToDelete));
    }
  }, []);

  const getCompletedTodos = (allTodos: Todo[]) => {
    const completedTodos = allTodos.filter(todo => todo.completed === true);

    return completedTodos.map(todo => todo.id);
  };

  const deleteCompletedTodos = useCallback(() => {
    const todoIdToDelete = getCompletedTodos(todosList);

    todoIdToDelete.forEach(itemId => deleteTodo(itemId));
  }, [deleteTodo, todosList]);

  const updateTodo = useCallback(async (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(curr => [...curr, todoId]);

    try {
      const updatedTodo = await changeTodo(todoId, newData);

      setTodosList(currentTodo => currentTodo.map(todo => {
        return todo.id === todoId
          ? updatedTodo
          : todo;
      }));
    } catch {
      setIsError(true);
      setErrorText(ErorrMessage.ON_UPDATE);
    } finally {
      setUpdatingTodoIds(currIds => currIds
        .filter(currId => currId !== todoId));
    }
  }, []);

  const isTodoExist = todosList.length > 0
    || filterCondition !== FilterCondition.ALL;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user?.id)
        .then(getSelected)
        .then(setTodosList)
        .catch(() => {
          setTodosList([]);
          setIsError(true);
          setErrorText(ErorrMessage.ON_UPLOAD);
        });
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosList={todosList}
          onSubmit={addTodo}
          newTodoField={newTodoField}
          setIsError={setIsError}
          setErrorText={setErrorText}
          isAdding={isAdding}
          updateTodo={updateTodo}
        />
        <TodoList
          todosList={todosList}
          tempNewTask={tempNewTask}
          deleteTodo={deleteTodo}
          deletingTodoIds={deletingTodoIds}
          updateTodo={updateTodo}
          updatingTodoIds={updatingTodoIds}

        />

        {isTodoExist && (
          <Footer
            todosList={todosList}
            filterCondition={filterCondition}
            setFilterCondition={setFilterCondition}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorText}
      </div>
    </div>
  );
};
