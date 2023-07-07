/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Todo, CreatedTodo, UpdatedTodo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { FilterTodos } from './types/FilterTodos';

const USER_ID = 10910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredTodos, setFiltredTodos] = useState<string>(FilterTodos.ALL);
  const [visibleError, setVisibleError] = useState('');
  const [title, setTitle] = useState('');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setVisibleError('Unable to load todos'));
  }, []);

  const visibleTodos = useMemo<Todo[]>(() => {
    return todos.filter(todo => {
      switch (filtredTodos) {
        case FilterTodos.ACTIVE:
          return !todo.completed;
        case FilterTodos.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filtredTodos]);

  const handleSubmit = async (data: CreatedTodo) => {
    try {
      if (title.trim() === '') {
        setVisibleError("Title can't be empty");

        return;
      }

      const newTodo = await createTodo(data);

      setTodos(prevTodos => ([...prevTodos, newTodo]));
      setTitle('');
    } catch (error) {
      setVisibleError('Unable to add a todo');
      setTitle('');
    }
  };

  const handleRemove = async (todoId: number) => {
    try {
      const removedTodo = await removeTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

      return removedTodo;
    } catch (error) {
      setVisibleError('Unable to delete a todo');

      return null;
    }
  };

  const handleChangeCheckBox = (todoId: number) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return { ...todo, completed: !todo.completed };
    }));
  };

  const handleClearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const removedTodos = await (completedTodos.map(todo => (
      removeTodo(todo.id))));

    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));

    return removedTodos;
  };

  const handleUpdateTodo = useCallback(async (
    todoId: number,
    args: UpdatedTodo,
  ) => {
    if (updatingTodoIds.includes(todoId)) {
      return;
    }

    setUpdatingTodoIds((prevState) => [...prevState, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, args);

      setTodos(prevTodos => (prevTodos.map((todo: Todo) => (
        todo.id === todoId
          ? updatedTodo
          : todo)) as Todo[]));
    } catch {
      setVisibleError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds([]);
    }
  }, [updatingTodoIds]);

  const handleSubmitonChange = (
    event: FormEvent,
    newTitle: string,
    id: number,
    isEdit: (value: boolean) => void,
    editTitle: (value: string) => void,
  ) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      removeTodo(id);

      setTodos((prevTodos: Todo[]) => prevTodos.filter(t => t.id !== id));
    }

    if (title !== newTitle) {
      handleUpdateTodo(id, { title: newTitle });
      isEdit(false);
    }

    isEdit(false);
    editTitle(newTitle.trim());
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          userId={USER_ID}
          todos={todos}
          setTodos={setTodos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleRemove={handleRemove}
          handleChangeCheckBox={handleChangeCheckBox}
          handleSubmitonChange={handleSubmitonChange}
        />

        {todos.length > 0 && (
          <TodoFooter
            visibleTodos={visibleTodos}
            filtredTodos={filtredTodos}
            setFiltredTodos={setFiltredTodos}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
