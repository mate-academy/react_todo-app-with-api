import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  addTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotes } from './components/ErrorNotes/ErrorNotes';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { SingleTodo } from './components/SingleTodo';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);

  const showError = (error: string) => {
    setErrorType(error);
    setTimeout(() => setErrorType(''), 3000);
  };

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
      setFilteredTodos(todosFromServer);
    } catch {
      showError('unable to download todo');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const add = useCallback(async (todo: Todo) => {
    if (!newTodoTitle) {
      showError('Title can\'t be empty');

      return;
    }

    setIsAdding(true);
    setActiveTodoId([todo.id]);

    if (!user) {
      return;
    }

    try {
      const response = await addTodo(user.id, todo);

      setTodos([...todos, response]);
    } catch {
      showError('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
      setNewTodoTitle('');
      setActiveTodoId([]);
    }
  }, [newTodoTitle]);

  const remove = useCallback(async (ids: number[]) => {
    if (!user) {
      return;
    }

    setActiveTodoId(ids);

    try {
      await Promise.all([...ids].map(id => {
        const todoToremove = todos.find(todo => todo.id === id);

        if (!todoToremove) {
          return null;
        }

        return removeTodo(user.id, todoToremove.id);
      }));

      const todosToStay = [...todos]
        .filter(todo => !ids.includes(todo.id));

      setTodos(todosToStay);
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setActiveTodoId([]);
    }
  }, [todos]);

  const toggle = useCallback(async (todosToToggle: Todo[]) => {
    if (!user) {
      return;
    }

    const ids: number[] = [];
    const todosToUpdate = todosToToggle.map(todo => {
      ids.push(todo.id);

      return {
        ...todo,
        completed: !todo.completed,
      };
    });

    setActiveTodoId(ids);

    try {
      await Promise.all([...ids].map(id => {
        const todoToUpdate = todosToUpdate.find(todo => todo.id === id);

        if (!todoToUpdate) {
          return null;
        }

        return updateTodo(user.id, todoToUpdate.id, todoToUpdate);
      }));

      const updatedTodos = todos.map(todo => {
        const newTodo = todo;

        if (ids.includes(newTodo.id)) {
          newTodo.completed = !newTodo.completed;
        }

        return newTodo;
      });

      setTodos(updatedTodos);
    } catch {
      showError('Unable to update a todo');
    } finally {
      setActiveTodoId([]);
    }
  }, [todos]);

  const update = useCallback(async (todoToUpdate: Todo) => {
    if (!user) {
      return;
    }

    setActiveTodoId([todoToUpdate.id]);

    try {
      await updateTodo(user.id, todoToUpdate.id, todoToUpdate);

      const updatedTodo = todos.find(todo => todoToUpdate.id === todo.id);

      if (updatedTodo) {
        updatedTodo.title = todoToUpdate.title;
      }
    } catch (error) {
      showError('Unable to update a todo');
    } finally {
      setActiveTodoId([]);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          todos={todos}
          setTempTodo={setTempTodo}
          setNewTodoTitle={setNewTodoTitle}
          add={add}
          toggle={toggle}
        />

        {(!!todos.length || isAdding) && (
          <>
            <Todos
              todos={filteredTodos}
              activeTodoId={activeTodoId}
              remove={remove}
              toggle={toggle}
              update={update}
            />
            {isAdding && tempTodo && (
              <SingleTodo
                todo={tempTodo}
                activeTodoId={activeTodoId}
                remove={remove}
                toggle={toggle}
                update={update}
              />
            )}
            <Footer
              todos={todos}
              setFilteredTodos={setFilteredTodos}
              remove={remove}
            />
          </>
        )}
      </div>
      <ErrorNotes
        errorType={errorType}
        setErrorType={setErrorType}
      />
    </div>
  );
};
