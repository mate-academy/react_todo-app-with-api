/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import {
  getTodos, addTodo, deleteTodo, completeTodo, editTodo,
} from './api/todos';
import { AuthContext } from './components/Auth';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [filter, setFilter] = useState(Filter.all);
  const [error, setError] = useState<string>('');
  const [hidden, setHidden] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);

  const user = useContext(AuthContext);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, []);

  const handleAdd = () => {
    if (!user) {
      return;
    }

    if (!title.trim()) {
      setError('empty');
      setHidden(false);
      setTimeout(() => setHidden(true), 3000);

      return;
    }

    setAdding(true);

    const todo = {
      title,
      userId: user.id,
      completed: false,
    };

    addTodo(todo)
      .then(result => setTodos(
        prevTodos => [...prevTodos, result],
      ))
      .catch(() => {
        setError(ErrorType.add);
        setHidden(false);
      })
      .finally(() => {
        setAdding(false);
        setTitle('');
        setTimeout(() => setHidden(true), 3000);
      });
  };

  const handleDelete = (id: number) => {
    setSelectedTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorType.delete);
        setHidden(false);
      })
      .finally(() => {
        setSelectedTodoIds([]);
        setTimeout(() => setHidden(true), 3000);
      });
  };

  const handleStatusChange = (id: number, data: boolean) => {
    setSelectedTodoIds(prev => [...prev, id]);

    completeTodo(id, data)
      .then(() => setTodos(prevTodos => {
        const selectedTodo = prevTodos.find(todo => todo.id === id);

        if (selectedTodo) {
          selectedTodo.completed = data;
        }

        return prevTodos;
      }))
      .catch(() => {
        setError(ErrorType.update);
        setHidden(false);
      })
      .finally(() => {
        setSelectedTodoIds([]);
        setTimeout(() => setHidden(true), 3000);
      });
  };

  const completeAll = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => handleStatusChange(todo.id, false));
    } else {
      todos.forEach(todo => handleStatusChange(todo.id, true));
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const handleFilter = (arr: Todo[], filterType: string) => {
    switch (filterType) {
      case Filter.active:
        return arr.filter(element => !element.completed);

      case Filter.completed:
        return arr.filter(element => element.completed);

      default:
        return arr;
    }
  };

  const handleDoubleClick = (id: number) => {
    setEditing(true);
    setSelectedTodoIds([id]);
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedTodoIds([]);
  };

  const handleEditing = (id: number, data: string, oldData: string) => {
    setEditing(false);

    if (!data.trim()) {
      handleDelete(id);

      return;
    }

    if (oldData === data) {
      handleCancel();

      return;
    }

    editTodo(id, data)
      .then(() => setTodos(prevTodos => {
        const selectedTodo = prevTodos.find(todo => todo.id === id);

        if (selectedTodo) {
          selectedTodo.title = data;
        }

        return prevTodos;
      }))
      .catch(() => {
        setError(ErrorType.update);
        setHidden(false);
      })
      .finally(() => {
        setSelectedTodoIds(prev => prev.filter(todoId => todoId !== id));
        setTimeout(() => setHidden(true), 3000);
      });
  };

  const visibleTodos = handleFilter(todos, filter);
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleAdd={handleAdd}
          setHidden={setHidden}
          adding={adding}
          completeAll={completeAll}
          completedTodosCount={completedTodos.length}
          todosCount={todos.length}
        />

        {(todos.length > 0 || adding) && (
          <>
            <TodosList
              todos={visibleTodos}
              title={title}
              adding={adding}
              handleDelete={handleDelete}
              handleStatusChange={handleStatusChange}
              handleEditing={handleEditing}
              selectedTodoIds={selectedTodoIds}
              editing={editing}
              handleDoubleClick={handleDoubleClick}
              handleCancel={handleCancel}
            />

            <Footer
              filter={filter}
              setFilter={setFilter}
              activeCount={activeCount}
              clearCompleted={clearCompleted}
              completedTodosCount={completedTodos.length}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hidden={hidden}
        setHidden={setHidden}
        onError={error}
      />
    </div>
  );
};
