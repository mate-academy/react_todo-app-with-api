/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from
  './components/ErrorMessage/ErrorMessage';

import { todoApi } from './api/todos';

import { Todo } from './types/Todo';
import { CompletedFilter } from './types/CompletedFilter';
import { filterTodosByCompleted, getCompletedTodoIds } from './heppers/helpers';
import { useError } from './controllers/useErrors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState(CompletedFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [, setSelectedTodoIds] = useState<number[]>([]);

  const [showError, closeErrorMessage, errorMessages] = useError();

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Todos loading failed'));
    }
  }, [user]);

  const addTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempTodo({
        ...fieldsForCreate,
        id: 0,
      });

      const newTodo = await todoApi.createTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError('Unable to add a todo');

      throw Error('Error while adding todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [showError]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete todo');
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const changeTodoStatus = useCallback(async (
    todoId: number, status: boolean,
  ) => {
    setSelectedTodoIds([todoId]);

    try {
      await todoApi.updateTodo(todoId, { completed: status });
      setTodos(prev => prev.map(todo => (
        todo.id === todoId
          ? { ...todo, completed: status }
          : todo
      )));
    } catch {
      showError('Unable to update todo status');
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  const updateTodoFields = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    try {
      const updatedTodo = await todoApi.updateTodo(todoId, fieldsToUpdate);

      setTodos((current) => current.map(todo => (
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo
      )));
    } catch {
      showError('Unable to update todo');
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const changeAllTodosStatus = useCallback(async () => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        updateTodoFields(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const deleteCompletedTodos = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => deleteTodo(id));
  }, [deleteTodo, todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos, completedFilter]);

  const visibleTodos = useMemo(() => (
    filterTodosByCompleted(todos, completedFilter)
  ), [todos, completedFilter]);

  const shouldRenderContent = todos.length > 0 || !!tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={addTodo}
          isAddingTodo={isAddingTodo}
          showError={showError}
          onChangeAllTodos={changeAllTodosStatus}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {shouldRenderContent && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              changeTodoStatus={changeTodoStatus}
              deletingTodoIds={deletingTodoIds}
              updateTodoFields={updateTodoFields}
              newTodoField={newTodoField}
            />

            <Footer
              activeTodos={activeTodos}
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
              onDeleteCompleted={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessages.length > 0 && (
        <ErrorMessage messages={errorMessages} close={closeErrorMessage} />
      )}
    </div>
  );
};
