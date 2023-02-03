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
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { FilterType } from './types/FiltersType';
import { getFilteredTodos } from './components/helpers/getFilteredTodos';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState(FilterType.All);
  const [errorText, setErrorText] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorText('Unable to load a todos'));
    }
  }, [user?.id]);

  const addNewTodo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      setErrorText('Title can\'t be empty');

      return;
    }

    const newTodoAdding = async () => {
      setIsAdding(true);

      if (user) {
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
        } catch {
          setErrorText('Unable to add a todo');
        } finally {
          setIsAdding(false);
        }
      }
    };

    newTodoAdding();
  }, [newTitle]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setSelectedTodosIds(prev => [...prev, todoId]);
    try {
      await removeTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (e) {
      setErrorText('Unable to delete a todo');
    } finally {
      setSelectedTodosIds(prev => {
        return prev.filter(deletingId => deletingId !== todoId);
      });
    }
  }, []);

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
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
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
    } catch (error) {
      setErrorText('Unable to update a todo');
    } finally {
      setSelectedTodosIds(todosIds => todosIds.filter(id => id !== todoId));
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        editTodo(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const activeTodosLength = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hascompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const shouldShowAll = todos.length > 0 || tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAddNewTodo={addNewTodo}
          isAdding={isAdding}
          onChangeAllTodos={changeAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {shouldShowAll && (
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
              activeTodos={activeTodosLength}
              completedFilter={completedFilter}
              onChangeType={setCompletedFilter}
              completedTodos={hascompletedTodos}
              onDeleteComplited={deleteAllComplitedTodos}
            />
          </>
        )}
      </div>
      {errorText && (
        <ErrorNotification
          errorText={errorText}
          onChangeErrorText={setErrorText}
        />
      )}
    </div>
  );
};
