/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getFilteredTodos } from './api/functions';
import {
  addTodo, getTodos, deleteTodo, changeTodo,
} from './api/todos';
import { AppFooter } from './components/AppFooter/AppFooter';
import { AppHeader } from './components/AppHeader/AppHeader';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<Filter>('All');
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      try {
        getTodos(user.id)
          .then(setTodos);
      } catch {
        setError('Can\'t load todo');
      }
    }
  }, []);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, statusFilter)
  ), [todos, statusFilter]);

  const addingNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title can\'t be empty');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setIsAdding(true);

      addTodo(newTodoTitle, user.id)
        .then((addingTodo) => {
          setTodos((currentTodos) => ([
            ...currentTodos,
            {
              id: addingTodo.id,
              userId: addingTodo.userId,
              title: addingTodo.title,
              completed: addingTodo.completed,
            },
          ]));
          setNewTodoTitle('');
        })
        .catch(() => {
          setError('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsAdding(false);
        });
    }
  };

  const removeTodo = useCallback(
    ((selectedTodoId: number) => {
      setLoadingTodosIds((currentTodosIds) => (
        [...currentTodosIds, selectedTodoId]
      ));

      deleteTodo(selectedTodoId)
        .then(() => (
          setTodos((currentTodos) => currentTodos.filter(
            todo => todo.id !== selectedTodoId,
          ))
        ))
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setLoadingTodosIds([]);
        });
    }), [],
  );

  const completedTodosLength = useMemo(() => (
    todos.filter(
      todo => todo.completed,
    ).length
  ), [todos]);

  const isAllCompleted = completedTodosLength === todos.length;

  const updateTodo = useCallback(async (
    todoId: number,
    dataToUpdate: Partial<Todo>,
  ) => {
    setLoadingTodosIds((currentTodosIds) => (
      [...currentTodosIds, todoId]
    ));

    try {
      await changeTodo(
        todoId,
        dataToUpdate,
      );

      setTodos(currentTodos => currentTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...dataToUpdate,
        };
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, []);

  const changeAllTodos = useCallback(() => (
    // eslint-disable-next-line array-callback-return
    todos.map(todo => {
      const todoNeedToBeUpdated = (!todo.completed && !isAllCompleted)
        || isAllCompleted;

      if (todoNeedToBeUpdated) {
        updateTodo(todo.id, { completed: !todo.completed });
      }
    })
  ), [todos]);

  const amountOfActive = useMemo(() => (
    todos.filter(
      todo => !todo.completed,
    ).length
  ), []);

  const clearCompletedTodos = useCallback(
    () => {
      todos.forEach(todo => {
        if (todo.completed) {
          removeTodo(todo.id);
        }
      });
    }, [todos],
  );

  const onCloseError = () => (
    setError('')
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AppHeader
          todos={todos}
          newTodoField={newTodoField}
          isAllCompleted={isAllCompleted}
          newTodoTitle={newTodoTitle}
          addingNewTodo={addingNewTodo}
          newTitle={setNewTodoTitle}
          isAdding={isAdding}
          changeAllTodos={changeAllTodos}
        />

        {(todos.length !== 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              onTodoDelete={removeTodo}
              tempTodo={tempTodo}
              loadingTodosIds={loadingTodosIds}
              updateTodo={updateTodo}
            />

            <AppFooter
              amountOfActive={amountOfActive}
              completedTodosLength={completedTodosLength}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onCloseError={onCloseError}
      />
    </div>
  );
};
