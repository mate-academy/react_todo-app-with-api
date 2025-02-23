/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { Filter } from './types/Filters';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  USER_ID,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Error } from './components/error';

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.all);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  function getVisibleTodos(filt: Filter) {
    switch (filt) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      case Filter.all:
      default:
        return todos;
    }
  }

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  const allComleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const active = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const complete = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function deleteOneTodo(todoId: number) {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  function deleteCompleted() {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteOneTodo(todo.id));
  }

  function toggleTodo(id: number) {
    const updatedTodo = todos.find(todo => todo.id === id);

    if (updatedTodo) {
      updateTodo({
        id,
        title: updatedTodo?.title,
        completed: !updatedTodo.completed,
      })
        .then(t => {
          setTodos((currentTodos: Todo[]) =>
            currentTodos.map(todo =>
              todo.id === id ? { ...todo, completed: t.completed } : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => setCurrentId(null));
    }
  }

  const toggleAll = () => {
    const allChecked = todos.every(todo => todo.completed);

    if (!allChecked) {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => toggleTodo(todo.id));
    } else {
      todos.forEach(todo => toggleTodo(todo.id));
    }
  };

  function updateTitle(id: number, newTitle: string) {
    const updatedTodo = todos.find(todo => todo.id === id);

    if (updatedTodo) {
      updateTodo({
        id,
        title: newTitle,
        completed: updatedTodo.completed,
      })
        .then(t => {
          setTodos((currentTodos: Todo[]) =>
            currentTodos.map(todo =>
              todo.id === id ? { ...todo, title: t.title } : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          setEditedTodoId(id)
        })
        .finally(() => {
          setCurrentId(null);
        });
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          addTodo={addTodo}
          allComleted={allComleted}
          setErrorMessage={setErrorMessage}
          loading={loading}
          toggleAll={toggleAll}
        />

        <TodoList
          visibleTodos={getVisibleTodos(filter)}
          deleteOneTodo={deleteOneTodo}
          tempTodo={tempTodo}
          currentId={currentId}
          setCurrentId={setCurrentId}
          toggleTodo={toggleTodo}
          editedTodoId={editedTodoId}
          setEditedTodoId={setEditedTodoId}
          updateTitle={updateTitle}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            active={active}
            complete={complete}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} />
    </div>
  );
};
