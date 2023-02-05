import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Filters } from './types/Filters';
import { Todo } from './types/Todo';

import { AuthContext } from './components/Auth/AuthContext';
import { TodosHeader } from './components/Auth/TodosHeader';
import { TodosItem } from './components/Auth/TodosItem';
import { TodosList } from './components/Auth/TodosList';
import { TodosFooter } from './components/Auth/TodosFooter';
import { ErrorMessage } from './components/Auth/ErrorMessage';

import { getVisibleTodos } from './tools/getVisibleTodos';

import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(Filters.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [deletedTodoID, setDeletedTodoID] = useState<number[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage('Unable to load a todos'));
    }
  }, [user?.id]);

  const addNewTodo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTodoAdding = async () => {
      setIsAdded(true);

      if (user) {
        setTemporaryTodo({
          id: 0,
          userId: user?.id,
          title: newTodoTitle,
          completed: false,
        });

        try {
          const newTodo = await addTodo({
            userId: user.id,
            title: newTodoTitle,
            completed: false,
          });

          setTemporaryTodo(null);

          setTodos(currentTodos => [...currentTodos, newTodo]);

          setNewTodoTitle('');
        } catch (e) {
          setErrorMessage('Unable to add a todo');
        } finally {
          setIsAdded(false);
        }
      }
    };

    newTodoAdding();
  }, [newTodoTitle]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodoID(prev => [...prev, todoId]);
    try {
      await removeTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletedTodoID(prev => {
        return prev.filter(deletedID => deletedID !== todoId);
      });
    }
  }, []);

  const deleteAllComplitedTodos = useCallback(async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletedTodoID(completedTodoId);

    await Promise.all(completedTodoId.map(id => deleteTodo(id)));
    setTodos(prev => prev.filter(todo => !completedTodoId.includes(todo.id)));

    setDeletedTodoID([0]);
  }, [todos]);

  const changeTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    setDeletedTodoID(prev => [...prev, todoId]);
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
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setDeletedTodoID(todosIds => todosIds.filter(id => id !== todoId));
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        changeTodo(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filterOption);
  }, [todos, filterOption]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddNewTodo={addNewTodo}
          isAdded={isAdded}
          onChangeAllTodos={changeAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {(todos.length > 0 || temporaryTodo) && (
          <>
            <TodosList
              todos={visibleTodos}
              onDeleteTodo={deleteTodo}
              selectedTodosID={deletedTodoID}
              onChangeTodo={changeTodo}
            />

            {temporaryTodo && (
              <TodosItem
                todo={temporaryTodo}
                onChangeTodo={changeTodo}
              />
            )}

            <TodosFooter
              activeTodos={activeTodos}
              filterOption={filterOption}
              onChangeFilterType={setFilterOption}
              completedTodos={completedTodos}
              onDeleteCompletedTodos={deleteAllComplitedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onChangeErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
