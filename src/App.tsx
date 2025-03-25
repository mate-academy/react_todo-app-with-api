/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTodo } from './types/FilterTodo';
import { Todo } from './types/Todo';
import * as api from './api/todos';

export const App: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtered, setFiltered] = useState<FilterTodo>(FilterTodo.All);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [updatingIds, setUpdatingIds] = useState<Todo[]>([]);

  useEffect(() => {
    setLoading(true);

    api
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filtered) {
      case FilterTodo.Active:
        filteredTodos = filteredTodos.filter(td => !td.completed);
        break;
      case FilterTodo.Completed:
        filteredTodos = filteredTodos.filter(td => td.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [filtered, todos]);

  const changeVisibleTodos = (el: FilterTodo) => {
    setFiltered(el);
  };

  const addTodo = async (title: string) => {
    if (title.trim().length === 0) {
      setErrorMsg('Title should not be empty');
      setAdding(false);
      setTempTodo(null);

      return;
    }

    const tempTodoItem = {
      id: 0,
      title,
      completed: false,
      userId: api.USER_ID,
    };

    setTempTodo(tempTodoItem);
    setAdding(true);
    setErrorMsg('');

    try {
      const newTodo = await api.addTodo({
        title,
        completed: false,
        userId: api.USER_ID,
      });

      setTodos(prevTodos => {
        return [...prevTodos, newTodo];
      });
      setTempTodo(null);
    } catch {
      setErrorMsg('Unable to add a todo');
    } finally {
      setAdding(false);
      setTempTodo(null);
    }
  };

  const updateTodo = async (todosToUpdate: Todo[]) => {
    setUpdatingIds(todosToUpdate);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo => api.updateTodo(todo)),
      );

      setTodos(prevTodos =>
        prevTodos.map(
          todo => updatedTodos.find(upd => upd.id === todo.id) || todo,
        ),
      );
    } catch (e) {
      setErrorMsg('Unable to update a todo');
      throw e;
    } finally {
      setUpdatingIds([]);
    }
  };

  const deleteTodo = async (todosId: number[]) => {
    setDeletedIds(todosId);
    const deleteId: number[] = [];

    try {
      await Promise.all(
        todosId.map(id =>
          api
            .deleteTodo(id)
            .then(() => {
              deleteId.push(id);
            })
            .catch(() => {
              setErrorMsg('Unable to delete a todo');
            }),
        ),
      );

      setTodos(prevTodos => {
        return prevTodos.filter(todo => !deleteId.includes(todo.id));
      });
    } catch (e) {
      setErrorMsg('Unable to delete a todo');
      throw e;
    } finally {
      setDeletedIds([]);
    }
  };

  if (!api.USER_ID) {
    return <UserWarning />;
  }

  const changeError = (er: string) => {
    setErrorMsg(er);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          adding={adding}
          errorMsg={errorMsg}
          todos={todos}
          onUpdate={updateTodo}
        />
        {!loading && (
          <TodoList
            errorMsg={errorMsg}
            todos={visibleTodos}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            deletedIds={deletedIds}
            tempTodo={tempTodo}
            adding={adding}
            updatingIds={updatingIds}
          />
        )}
        {todos.length > 0 && (
          <Footer
            changeVisibleTodos={changeVisibleTodos}
            filtered={filtered}
            todos={todos}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMsg} changeError={changeError} />
    </div>
  );
};
