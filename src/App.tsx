/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodoById,
  updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState(FilterType.ALL);
  const [error, setError] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setError(ErrorType.LOAD));
    }
  }, [user]);

  const addNewTodo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      setError(ErrorType.EMPTY);

      return;
    }

    const newTodoAdding = async () => {
      if (!user) {
        return;
      }

      setIsAdding(true);

      setTempTodo({
        id: 0,
        userId: user?.id,
        title: newTitle,
        completed: false,
      });

      try {
        const newTodo = await addTodo({
          userId: user.id,
          title: newTitle,
          completed: false,
        });

        setTempTodo(null);

        setTodos(currentTodos => [...currentTodos, newTodo]);

        setNewTitle('');
      } catch (e) {
        setError(ErrorType.ADD);
      } finally {
        setIsAdding(false);
      }
    };

    newTodoAdding();
  }, [newTitle]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setSelectedTodosIds(prev => [...prev, todoId]);
    try {
      await deleteTodoById(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (e) {
      setError(ErrorType.DELETE);
    } finally {
      setSelectedTodosIds(prev => {
        return prev.filter(deletingId => deletingId !== todoId);
      });
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterTodo) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterType.ALL:
      default:
        return todos;
    }
  }, [todos, filterTodo]);

  const activeTodosQuantity = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodosQuantity = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const deleteAllComplitedTodos = useCallback(async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setSelectedTodosIds(completedTodoId);

    await Promise.all(completedTodoId.map(id => deleteTodo(id)));
    setTodos(prev => prev.filter(todo => !completedTodoId.includes(todo.id)));

    setSelectedTodosIds([0]);
  }, [todos]);

  const editTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    setSelectedTodosIds(prev => [...prev, todoId]);
    try {
      await updateTodo(
        todoId,
        fieldsToUpdate,
      );

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...fieldsToUpdate }
          : todo
      )));
    } catch (e) {
      setError(ErrorType.UPDATE);
    } finally {
      setSelectedTodosIds(todosIds => todosIds
        .filter((id: number) => id !== todoId));
    }
  }, []);

  const toggleAllTodos = async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    await editTodo(todoId, fieldsToUpdate);
  };

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        toggleAllTodos(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          addNewTodo={addNewTodo}
          isAdding={isAdding}
          changeAllTodos={changeAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              onTodoDelete={deleteTodo}
              selectedTodosIds={selectedTodosIds}
              onEditTodo={editTodo}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                onEditTodo={editTodo}
              />
            )}
            <Footer
              activeTodosQuantity={activeTodosQuantity}
              completedTodosQuantity={completedTodosQuantity}
              filterType={filterTodo}
              setFilterTodo={setFilterTodo}
              deleteAllComplitedTodos={deleteAllComplitedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setErrorMessage={setError}
        />
      )}
    </div>
  );
};
