/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ErrorField } from './components/ErrorField/ErrorField';

import { Todo } from './types/Todo';
import { FilterBy, ERROR, TempTodoAction } from './types/enums';
import { addTodo, getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterQwery, setFilterQwery] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<ERROR | string>(
    ERROR.no_error,
  );
  const [tempTodo, setTempTodo] = useState<{
    type: TempTodoAction;
    todo?: Todo;
    todoId?: Todo['id'];
  } | null>(null);
  const [todosLoading, setTodosLoading] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setErrorMessage(ERROR.todos);
    }
  }, []);

  const addItem = async (inputField: HTMLInputElement) => {
    const value = inputField.value;
    const id = 0;

    try {
      if (value.trim() === '') {
        throw new Error(ERROR.title);
      }

      const todo: Omit<Todo, 'id'> = {
        title: value.trim(),
        userId: USER_ID,
        completed: false,
      };

      setTodosLoading([id]);
      setTempTodo({ type: TempTodoAction.add, todo: { ...todo, id } });

      const res = await addTodo(todo);

      setTodos(prev => [...prev, res as Todo]);
    } catch (err) {
      const error = err as Error;

      setErrorMessage(error.message || ERROR.add);
      throw new Error(ERROR.add);
    } finally {
      setTempTodo(null);
      setTodosLoading([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const adIdToLoadingList = useCallback((id: number) => {
    setTodosLoading(prev => [...prev, id]);
  }, []);

  const removeIdFromLoadingList = useCallback((id: number | null) => {
    setTodosLoading(prev => prev.filter(item => item !== id));
  }, []);

  const filteredTodos = (qwery: FilterBy, list: Todo[]): Todo[] => {
    return list.filter(item => {
      switch (qwery) {
        case FilterBy.Active:
          return !item.completed;
        case FilterBy.Completed:
          return item.completed;
        case FilterBy.All:
          return true;
      }
    });
  };

  const visibleTodos = useMemo(() => {
    let todoList = [...todos];

    if (tempTodo) {
      switch (tempTodo.type) {
        case TempTodoAction.add:
          if (tempTodo.todo) {
            todoList = [...todoList, tempTodo.todo];
          }

          break;
        case TempTodoAction.remove:
          todoList = todoList.filter(item => item.id !== tempTodo.todoId);
          break;
      }
    }

    return filteredTodos(filterQwery, todoList);
  }, [todos, filterQwery, tempTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          addItem={addItem}
          setTodos={setTodos}
          loadingIdsState={{ adIdToLoadingList, removeIdFromLoadingList }}
          todos={todos}
        />
        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            loadingIdsState={{ adIdToLoadingList, removeIdFromLoadingList }}
            setErrorMessage={setErrorMessage}
            setTodos={setTodos}
            todosLoading={todosLoading}
            setTempTodo={setTempTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterQwery={filterQwery}
            setFilterQwery={setFilterQwery}
            loadingIdsState={{ adIdToLoadingList, removeIdFromLoadingList }}
            setErrorMessage={setErrorMessage}
            setTodos={setTodos}
            todosLoading={todosLoading}
          />
        )}
      </div>
      <ErrorField
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
