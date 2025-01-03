import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as Server from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { filterTodos } from './utils/functions';
import { Filter, TodoError } from './types/types';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errors, setErrors] = useState<TodoError | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[] | null>(null);
  const [activeChangeId, setActiveChangeId] = useState<number | null>(null);
  const [loaderId, setLoaderId] = useState<number[]>([]);
  const [editedTodo, setEditedTodo] = useState('');

  function getData() {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();

        setTodosList(todos);
      } catch (error) {
        setErrors(TodoError.LoadError);
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    };

    fetchTodos();
  }

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setDeletedTodoId([id]);
      await Server.deletePost(id);
      setTodosList(todosList.filter(el => el.id !== id));
    } catch (error) {
      setErrors(TodoError.DeleteError);
      setTimeout(() => {
        setErrors('');
      }, 3000);

      return false;
    } finally {
      setDeletedTodoId(null);
    }

    return true;
  };

  const getUpdatedTodos = (todos: Todo[]) => {
    const allCompleted = todos.every(todo => todo.completed);
    let updatedTodos;

    if (allCompleted) {
      updatedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));
    } else {
      updatedTodos = todos.map(todo => ({
        ...todo,
        completed: todo.completed ? todo.completed : true,
      }));
    }

    return updatedTodos;
  };

  const toggleAll = async () => {
    try {
      const updatedTodos = getUpdatedTodos(todosList);

      const todosToUpdate = updatedTodos.filter(
        (todo, index) => todosList[index].completed !== todo.completed,
      );

      setLoaderId(todosToUpdate.map(todo => todo.id));
      const updatePromises = todosToUpdate.map(todo => Server.updatePost(todo));

      await Promise.all(updatePromises);
      setTodosList(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = todosToUpdate.find(
            updated => updated.id === todo.id,
          );

          return updatedTodo || todo;
        }),
      );
    } catch (error) {
      setErrors(TodoError.ToggleError);
      setTimeout(() => {
        setErrors('');
      }, 3000);
    } finally {
      setLoaderId([]);
    }
  };

  const updateStatus = async (todo: Todo) => {
    try {
      setLoaderId([todo.id]);
      await Server.updatePost({ ...todo, completed: !todo.completed });
      setTodosList(prevTodos =>
        prevTodos.map(prevTodo => {
          if (prevTodo.id === todo.id) {
            return { ...prevTodo, completed: !prevTodo.completed };
          }

          return prevTodo;
        }),
      );
    } catch {
      setErrors(TodoError.UpdateError);
      setTimeout(() => {
        setErrors('');
      }, 3000);
    } finally {
      setLoaderId([]);
    }
  };

  const deleteCompleted = async (todoIds: number[]) => {
    todoIds.map(async id => {
      try {
        setDeletedTodoId(todoIds);
        await Server.deletePost(id);
        setTodosList(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } catch {
        setErrors(TodoError.DeleteError);
        setTimeout(() => {
          setErrors('');
        }, 3000);
      } finally {
        setDeletedTodoId(null);
      }
    });
  };

  function loseFocus(id: number) {
    if (todosList) {
      setTodosList(
        todosList?.map(todo => {
          if (activeChangeId === todo.id && editedTodo) {
            return { ...todo, title: editedTodo };
          }

          return todo;
        }),
      );
    }

    setEditedTodo('');
    setActiveChangeId(id);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todosList, filter);

  const defaultTempTodo = {
    id: 0,
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todosList}
          tempTodo={tempTodo}
          title={title}
          defaultTempTodo={defaultTempTodo}
          setErrors={setErrors}
          setTodos={setTodosList}
          setTempTodo={setTempTodo}
          setNewTodo={setTitle}
          deletedTodoId={deletedTodoId}
          toggleAll={toggleAll}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deletedTodoId={deletedTodoId}
          tempTodo={tempTodo}
          setTodos={setTodosList}
          setErrors={setErrors}
          handleDelete={handleDelete}
          defaultTempTodo={defaultTempTodo}
          activeChangeId={activeChangeId}
          setActiveChangeId={setActiveChangeId}
          loaderId={loaderId}
          updateStatus={updateStatus}
          loseFocus={loseFocus}
          editedTodo={editedTodo}
          setEditedTodo={setEditedTodo}
          setLoaderId={setLoaderId}
        />

        {!!todosList.length && (
          <Footer
            todos={todosList}
            filter={filter}
            setFilter={setFilter}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      <Errors error={errors} setErrors={setErrors} />
    </div>
  );
};
