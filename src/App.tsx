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
  const [Loading, setLoading] = useState<number[]>([]);

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

  const deleteTodo = (id: number) => {
    return todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      });
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    return todoService.updateTodo({ ...todoToUpdate, title: newTitle })
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(
          todo => ((todo.id === updatedTodo.id) ? updatedTodo : todo),
        ));
      })
      .catch(error => {
        showError('Unable to rename a todo');
        throw error;
      });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
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
      });
  };

  const handleUpdateTodo = useCallback((todoToUpdate: Todo) => {
    setLoading(currentValues => [...currentValues, todoToUpdate.id]);

    todoService.updateTodo(todoToUpdate)
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id === todoToUpdate.id ? todoToUpdate : todo
        )));
        setLoading([]);
      })
      .catch(() => setErrorMessage('Unable to toggle a todo'));
  }, []);

  const toggleAllTodos = useCallback(() => {
    return todos.every(todo => todo.completed)
      ? todos.map(todo => {
        const todoToUpdate = {
          ...todo,
          completed: false,
        };

        return handleUpdateTodo(todoToUpdate);
      }) : todos.map(todo => {
        const todoToUpdate = {
          ...todo,
          completed: true,
        };

        return handleUpdateTodo(todoToUpdate);
      });
  }, [todos]);

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
        />

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={() => deleteTodo(todo.id)}
              onRename={(newTitle) => renameTodo(todo, newTitle)}
              onToggle={() => toggleTodo(todo)}
              loading={Loading.includes(todo.id)}
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
