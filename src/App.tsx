/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Todo } from './types/Todo';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { Filter } from './components/Filter/Filter';
import { TodoError } from './components/Notification/TodoError';
import { TodoList } from './components/TodoList/TodoList';
import { filteredTodos, getCompletedTodoIds } from './utils/functions';
import { todoApi } from './api/todos';
import { Filters } from './types/FilterEnum';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(Filters.ALL);
  const [isAddingTodo, setIsEddingTodo] = useState(false);
  const [delitingTodoIds, setDelitingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => setError('Unable to load a todos'));
    }
  }, []);

  const activeTodo = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => (
    filteredTodos(todos, filterStatus)
  ), [todos, filterStatus]);

  const handleAddTodo = useCallback(
    async (fieldsForCreate: Omit<Todo, 'id'>) => {
      try {
        setIsEddingTodo(true);
        setTempTodo({
          ...fieldsForCreate,
          id: 0,
        });

        const newTodo = await todoApi.addTodo(fieldsForCreate);

        setTodos(prev => [...prev, newTodo]);
      } catch {
        setError('Unable to add a todo');

        throw Error('Error on adding todo');
      } finally {
        setTempTodo(null);
        setIsEddingTodo(false);
      }
    }, [errorMessage],
  );

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setDelitingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDelitingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const handleDeleteCompleted = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => handleDeleteTodo(id));
  }, [handleDeleteTodo, todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(prevIds => {
      if (!prevIds.includes(todoId)) {
        return [...prevIds, todoId];
      }

      return prevIds;
    });

    try {
      const updatedTodo = await todoApi.updateTodo(todoId, updateData);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds(prevTodos => prevTodos
        .filter(prevTodoId => prevTodoId !== todoId));
    }
  }, []);

  const completedTodosAmount = useMemo(() => {
    return visibleTodos.filter(todo => todo.completed).length;
  }, [visibleTodos]);

  const isAllTodosCompleted = todos.length === completedTodosAmount;

  const handleToogleTodoStatus = useCallback(() => {
    todos.forEach(todo => {
      const isNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isNeedToUpdate || isAllTodosCompleted) {
        updateTodo(todo.id, { completed: !todo.completed });
      }
    });
  }, [isAllTodosCompleted, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoField={newTodoField}
          showError={() => setError('Title is required')}
          isAddingTodo={isAddingTodo}
          onAddTodo={handleAddTodo}
          isAllTodosCompleted={isAllTodosCompleted}
          onToogleTodoStatus={handleToogleTodoStatus}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              delitingTodoIds={delitingTodoIds}
              updateTodo={updateTodo}
              updatingTodoIds={updatingTodoIds}
            />
            <Filter
              activeTodos={activeTodo}
              filter={filterStatus}
              onChange={setFilterStatus}
              onDeleteCompleted={handleDeleteCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <TodoError
          message={errorMessage}
          onHideError={setError}
        />
      )}
    </div>
  );
};
