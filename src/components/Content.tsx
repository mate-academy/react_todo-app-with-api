import React, { useEffect, useMemo, useState } from 'react';

import { removeTodos, saveTodo, updateTodo } from '../api/todos';

import { Todo } from '../types/Todo';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { TodoItem } from './TodoItem';

import { Filter } from '../types/Filter';
import { Error } from '../types/Error';

type Props = {
  todos: Todo[],
  changeTodos: (todos: Todo[]) => void,
  userId: number,
  onError: (errorText: Error) => void,
  onHidden: (visibility: boolean) => void,
};

export const Content: React.FC<Props> = ({
  todos,
  changeTodos,
  userId,
  onError,
  onHidden,
}) => {
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [changingTodoTitle, setChangingTodoTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAdded(true);

    if (newTodoTitle.length) {
      const newTodoData = {
        userId,
        title: newTodoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        userId,
        title: newTodoTitle,
        completed: false,
      });

      saveTodo(userId, newTodoData)
        .then(result => {
          changeTodos([...todos, result]);
          setNewTodoTitle('');
        })
        .catch(() => {
          onError(Error.addError);
          onHidden(false);
        })
        .finally(() => {
          setIsAdded(false);
          setTempTodo(null);
        });
    } else {
      onError(Error.emptyError);
      onHidden(false);
      setIsAdded(false);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setisLoading(true);

    removeTodos(id)
      .then(() => changeTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        onError(Error.deleteError);
        onHidden(false);
      })
      .finally(() => setisLoading(false));
  };

  const handleDeleteCompletedTodo = () => {
    setisLoading(true);

    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(id => {
      removeTodos(id)
        .then(() => changeTodos(todos.filter(todo => !todo.completed)))
        .catch(() => {
          onError(Error.deleteError);
          onHidden(false);
        })
        .finally(() => setisLoading(false));
    });
  };

  const handleTodoChange = (
    completed: boolean,
    title: string,
    id: number,
  ) => {
    const newData = {
      userId,
      title,
      completed: !completed,
    };

    setisLoading(true);

    if (title.length) {
      updateTodo(id, newData)
        .then(result => {
          const newTodos = todos.map(todo => {
            if (todo.id === id) {
              return result;
            }

            return todo;
          });

          changeTodos(newTodos);
        })
        .catch(() => {
          onError(Error.updateError);
          onHidden(false);
        })
        .finally(() => setisLoading(false));
    } else {
      onError(Error.emptyError);
      onHidden(false);
      setisLoading(false);
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChangingTodoTitle(event.target.value);
  };

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => {
      switch (filter) {
        case (Filter.all):
          return !!todo;

        case (Filter.active):
          return !todo.completed;

        case (Filter.completed):
          return todo.completed;

        default:
          return false;
      }
    }));
  }, [visibleTodos, filter]);

  const isAllTodosActive = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const isSomeTodoCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  return (
    <div className="todoapp__content">
      <Header
        allActive={isAllTodosActive}
        title={newTodoTitle}
        onChange={handleTitleChange}
        onAddTodo={handleAddTodo}
        onAdding={isAdded}
        todos={todos}
      />

      <Main
        visibleTodos={visibleTodos}
        loading={isLoading}
        onDeleteTodo={handleDeleteTodo}
        onTodoChange={handleTodoChange}
        onChangeTitle={handleTodoTitleChange}
        changingTitle={changingTodoTitle}
        setTodoTitle={setChangingTodoTitle}
      />

      {!tempTodo || <TodoItem todo={tempTodo} />}

      {(todos?.length || tempTodo) && (
        <Footer
          someCompleted={isSomeTodoCompleted}
          activeTodos={activeTodos}
          filter={filter}
          onChange={setFilter}
          onClearCompleted={handleDeleteCompletedTodo}
        />
      )}
    </div>
  );
};
