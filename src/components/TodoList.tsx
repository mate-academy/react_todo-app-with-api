/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo as TypeTodo } from '../types/Todo';
import { USER_ID, deleteTodo, updateTodo } from '../api/todos';
import { ErrorMessages, handleThenUpdateCompleted } from '../App';
import Todo from './Todo';

type Props = {
  todoList: TypeTodo[];
  todos: TypeTodo[];
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>;
  setError: (error: ErrorMessages) => void;
  setLoading: (loading: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList = [],
  todos,
  setTodos,
  setError,
  setLoading,
}) => {
  const [formActive, setFormActive] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoId, setTodoId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [idsToUptdated, setIdsToUpdated] = useState<number[]>([]);

  useEffect(() => {
    if (formActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formActive]);

  function handleSetFormActive(title: string, id: number) {
    setFormActive(true);
    setTodoId(id);

    setTodoTitle(title);
    setTempTitle(title);
  }

  const handleChangeCompleted = useCallback(
    (todoSelect: TypeTodo) => {
      setError(ErrorMessages.Empty);
      setIdsToUpdated(state => [...state, todoSelect.id]);
      updateTodo({
        id: todoSelect.id,
        userId: USER_ID,
        title: todoSelect.title,
        completed: !todoSelect.completed,
      })
        .then(updatedTodo => {
          setTodos(last =>
            handleThenUpdateCompleted(last, todoSelect, updatedTodo),
          );
        })
        .catch(() => setError(ErrorMessages.UnableUpdate))
        .finally(() =>
          setIdsToUpdated(state => state.filter(el => el !== todoSelect.id)),
        );
    },
    [setError, setTodos],
  );

  function handleDeleteTodo(id: number) {
    setLoading(true);
    setError(ErrorMessages.Empty);
    setIdsToUpdated(state => [...state, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(state => state.filter(todo => todo.id !== id));
      })
      .catch(() => setError(ErrorMessages.UnableDelete))
      .finally(() => {
        setIdsToUpdated(state => state.filter(el => el !== id));
        setLoading(false);
      });
  }

  function handleUpdateTitleTodo(todoSelect: TypeTodo) {
    setError(ErrorMessages.Empty);
    setIdsToUpdated(state => [...state, todoSelect.id]);

    setTodos(
      todos.map(todo =>
        todo.id === todoId ? { ...todo, title: todoTitle } : todo,
      ),
    );

    if (tempTitle !== todoTitle.trim()) {
      if (todoTitle.trim() === '') {
        handleDeleteTodo(todoSelect.id);

        return;
      }

      updateTodo({
        id: todoSelect.id,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: todoSelect.completed,
      })
        .then(updatedTodo => {
          setTodos(state =>
            state.map(todo => {
              if (todo.id === todoId) {
                return { ...todo, title: updatedTodo.title };
              }

              return todo;
            }),
          );
          setTempTitle('');
          setFormActive(false);
        })
        .catch(() => {
          setError(ErrorMessages.UnableUpdate);
          setFormActive(true);
        })
        .finally(() => {
          setIdsToUpdated(state => state.filter(el => el !== todoSelect.id));
        });
    } else {
      setIdsToUpdated(state => state.filter(el => el !== todoSelect.id));
      setFormActive(false);
    }
  }

  function handleBlur(todoSelect: TypeTodo) {
    if (idsToUptdated.length === 0) {
      handleUpdateTitleTodo(todoSelect);

      return;
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: TypeTodo,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault();

      handleUpdateTitleTodo(todo);

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setFormActive(false);

      return;
    }
  }

  return (
    <>
      {todoList.map(todo => (
        <Todo
          key={todo.id}
          formActive={formActive}
          handleBlur={handleBlur}
          todo={todo}
          todoTitle={todoTitle}
          handleChangeCompleted={handleChangeCompleted}
          handleDeleteTodo={handleDeleteTodo}
          handleKeyDown={handleKeyDown}
          handleSetFormActive={handleSetFormActive}
          idsToUptdated={idsToUptdated}
          inputRef={inputRef}
          setTodoTitle={setTodoTitle}
          todoId={todoId}
        />
      ))}
    </>
  );
};
