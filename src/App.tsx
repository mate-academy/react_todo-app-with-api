import { useCallback, useEffect, useRef, useState } from 'react';

import * as todoService from './api/todos';
import { Todo, TodoAdd } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorOptions } from './types/ErrorOptions';
import { DEFAULT_ID } from './constants/DEFAULT_ID';

import UserWarning from './UserWarning';
import HeaderMemo from './components/Header';
import FooterMemo from './components/Footer';
import TodoList from './components/TodoList';
import TodoError from './components/TodoError';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [errorOption, setErrorOption] = useState(ErrorOptions.NONE);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [hasTitleFocus]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorOption(ErrorOptions.LOAD));
  }, []);

  useEffect(() => {
    if (errorOption === ErrorOptions.NONE) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorOption(ErrorOptions.NONE);
    }, 3_000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorOption]);

  const filteredTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.ACTIVE:
        return !todo.completed;
      case FilterOptions.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const onAdd = useCallback((todoDataAdd: TodoAdd) => {
    const currentTitleRef = titleRef.current;

    if (currentTitleRef) {
      currentTitleRef.disabled = true;
      setHasTitleFocus(true);
      setLoadingTodoIds([DEFAULT_ID]);
      setTempTodo({ ...todoDataAdd, id: DEFAULT_ID });

      todoService
        .addTodos(todoDataAdd)
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);

          currentTitleRef.value = '';
        })
        .catch(() => setErrorOption(ErrorOptions.ADD))
        .finally(() => {
          currentTitleRef.disabled = false;
          setHasTitleFocus(false);
          setLoadingTodoIds([]);
          setTempTodo(null);
        });
    }
  }, []);

  const onDelete = useCallback((todoIds: number[]) => {
    setHasTitleFocus(true);
    setLoadingTodoIds(todoIds);

    const deletePromises = todoIds.map(todoId => {
      return todoService
        .deleteTodos(todoId)
        .then(() => todoId)
        .catch(() => setErrorOption(ErrorOptions.DELETE));
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
        .updateTodos(todoDataUpdate)
        .then(updatedTodo => updatedTodo)
        .catch(() => {
          setErrorOption(ErrorOptions.UPDATE);

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
        <HeaderMemo
          todos={todos}
          titleRef={titleRef}
          setErrorOption={setErrorOption}
          onAdd={onAdd}
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
          <FooterMemo
            todos={todos}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            onDelete={onDelete}
          />
        )}
      </div>

      <TodoError errorOption={errorOption} setErrorOption={setErrorOption} />
    </div>
  );
}
