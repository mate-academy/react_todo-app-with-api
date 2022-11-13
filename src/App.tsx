import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { FilterPanel } from './components/FilterPanel';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, editTodoCompleted, getTodos,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { TodoForm } from './components/TodoForm';
import { TodoForServer } from './types/TodoForServer';
import { ToggleCompleted } from './components/ToggleCompleted';

export const App: React.FC = () => {
  // Utils
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  // Error
  const [currentError, setCurrentError] = useState('');

  const resetCurrentError = () => setCurrentError('');

  // Filter
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);

  const selectFilterType = (type: FilterType) => {
    setFilterType(type);
  };

  // Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const addTodos = (todo: Todo) => {
    setTodos(currentTodo => [...currentTodo, todo]);
  };

  const loadTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
      }
    }
  };

  const visibleTodos = (): Todo[] => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Loading todos
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const addLoadingTodo = (id: number) => {
    setLoadingTodos((value) => {
      return [...value, id];
    });
  };

  const deleteLoadingTodo = (id: number) => {
    setLoadingTodos((todosIndex) => {
      return todosIndex.filter(todoId => todoId !== id);
    });
  };

  // Adding
  const [isAdding, seIsAdding] = useState(false);

  const changeIsAdding = (value: boolean) => seIsAdding(value);

  // New todos
  const [newTodo, setNewTodo] = useState<TodoForServer>();

  const isValidTodo = newTodo?.title.trim().length;

  const addNewTodo = (title: string) => {
    const input = {
      userId: user?.id || 0,
      title,
      completed: false,
    };
    const isValidInput = input.title.trim().length && (
      !todos.some(todo => todo.title === input.title)
    );

    if (isValidInput) {
      addLoadingTodo(0);
      setNewTodo(input);
    } else {
      setCurrentError('title');
    }
  };

  const uploadTodo = async () => {
    if (user && newTodo && isValidTodo) {
      try {
        await addTodo(user.id, newTodo);
        await loadTodos();
        changeIsAdding(false);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.message);
        setCurrentError('add');
      }
    }
  };

  // Delete todos
  const deleteTodoFromServer = async (id: number, reload: boolean) => {
    try {
      await deleteTodo(id);

      if (reload) {
        await loadTodos();
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setCurrentError('delete');
    }
  };

  const deleteCompletedTodos = async () => {
    completedTodos.map(todo => todo.id)
      .forEach(todoId => addLoadingTodo(todoId));
    await Promise.all(
      completedTodos.map(todo => todo.id)
        .map(todoId => deleteTodoFromServer(todoId, false)),
    );
    await loadTodos();
  };

  // Edit todos completed
  const changeTodoCompleted = async (id: number, todo: Partial<Todo>) => {
    try {
      await editTodoCompleted(id, todo);
      await loadTodos();
      deleteLoadingTodo(id);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setCurrentError('update');
    }
  };

  const changeTodosGroup = async (group: Todo[]) => {
    group.map(currentTodo => currentTodo.id)
      .forEach(todoId => addLoadingTodo(todoId));

    await Promise.all(
      group.map(activeTodo => (
        changeTodoCompleted(activeTodo.id, {
          ...activeTodo, completed: !activeTodo.completed,
        })
      )),
    );

    group.map(currentTodo => currentTodo.id)
      .forEach(todoId => deleteLoadingTodo(todoId));
  };

  const changeAllTodoCompleted = async () => {
    if (completedTodos.length === todos.length) {
      await changeTodosGroup(completedTodos);
    } else {
      await changeTodosGroup(activeTodos);
    }

    await loadTodos();
  };

  // Effects
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (currentError) {
      setTimeout(() => {
        resetCurrentError();
      }, 3000);
    }
  }, [currentError]);

  useEffect(() => {
    if (newTodo) {
      addTodos({
        id: 0,
        ...newTodo,
      });

      changeIsAdding(true);
      uploadTodo();
    }
  }, [newTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleCompleted
            toggleAllCompleted={changeAllTodoCompleted}
            isActive={(completedTodos.length === todos.length)
              && (todos.length > 0)}
          />

          <TodoForm
            setNewTodo={addNewTodo}
            isAdding={isAdding}
            newTodoField={newTodoField}
          />
        </header>

        <TodoList
          todos={visibleTodos()}
          deleteTodo={deleteTodoFromServer}
          loadingTodos={loadingTodos}
          addLoadingTodo={addLoadingTodo}
          changeTodoCompleted={changeTodoCompleted}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <FilterPanel
            todosCount={activeTodos.length}
            filterType={filterType}
            setFilterType={selectFilterType}
            deleteCompletedTodos={deleteCompletedTodos}
            isCompletedTodos={completedTodos.length > 0}
          />
        )}

      </div>

      {currentError && (
        <Error
          error={currentError}
          resetError={resetCurrentError}
        />
      )}

    </div>
  );
};
