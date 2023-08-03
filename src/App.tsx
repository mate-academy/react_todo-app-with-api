/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as todoService from './api/todos';

import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { TodoErrorMessage } from './components/TodoErrorMessage';
import { TodoFooter } from './components/TodoFooter';
import { FilterTypes } from './types/FilterTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterTypes.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<number[]>([]);

  const errorTimerId = useRef(0);

  const showError = (message: string) => {
    setErrorMessage(message);

    window.clearTimeout(errorTimerId.current);

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(error => {
        showError('Unable to load todos');
        throw error;
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterValue) {
      case FilterTypes.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case FilterTypes.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filterValue]);

  const addTodo = (title: string) => {
    return todoService.createTodo(title)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        showError('Unable to add a todo');
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(ids => [...ids, todoId])

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoading(ids => ids.filter(id => id !== todoId))
      })
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    setLoading(ids => [...ids, todoToUpdate.id]);

    return todoService.updateTodo({ ...todoToUpdate, title: newTitle })
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(
          todo => ((todo.id === updatedTodo.id) ? updatedTodo : todo),
        ));
      })
      .catch(error => {
        showError('Unable to rename a todo');
        throw error;
      })
      .finally(() => {
        setLoading(ids => ids.filter(id => id !== todoToUpdate.id))
      })
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setLoading(ids => [...ids, todoToUpdate.id])

    return todoService.updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(
          todo => ((todo.id === updatedTodo.id) ? updatedTodo : todo),
        ));
      })
      .catch(() => {
        showError('Unable to toggle a todo');
      })
      .finally(() => {
        setLoading(ids => ids.filter(id => id !== todoToUpdate.id));
      });
  };

  const allCompleted = useMemo(() => {
    return filteredTodos.every(todo => todo.completed);
  }, [filteredTodos]);

  const toggleAllTodos = useCallback(() => {
    if (allCompleted) {
      filteredTodos.forEach(toggleTodo);
    } else {
      filteredTodos
        .filter(todo => !todo.completed)
        .forEach(toggleTodo);
    }
  }, [filteredTodos]);

  const deleteAllCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setLoading(currentValue => [...currentValue, todo.id]);
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          todos={todos}
          showError={showError}
          setTempTodo={setTempTodo}
          onToggleAllTodos={toggleAllTodos}
          allCompleted={allCompleted}
        />

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={() => deleteTodo(todo.id)}
              onRename={(newTitle) => renameTodo(todo, newTitle)}
              onToggle={() => toggleTodo(todo)}
              loading={loading.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
            />
          )}
        </section>

        {todos.length > 0 && (
          <TodoFooter
            todos={filteredTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onClearBtn={deleteAllCompletedTodos}
          />
        )}
      </div>

      <TodoErrorMessage errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
