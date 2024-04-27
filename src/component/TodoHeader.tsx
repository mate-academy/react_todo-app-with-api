import React, { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID, createTodo } from '../api/todos';
import { TodosContext } from '../TodosProvider/TodosProvider';
import classNames from 'classnames';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const focus = useRef<HTMLInputElement>(null);
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    isCompleted,
    setIdDisabled,
    setFocused,
    isDisabled,
    setLoadingIds,
    focused,
    handleToggle,
    hideMessage,
    everyCompleted,
  } = useContext(TodosContext);

  let isError = false;

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, [focused]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      userId: USER_ID,
      title: title.trim(),
      completed: isCompleted,
    };

    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: isCompleted,
    };

    setTempTodo(temporaryTodo);
    setIdDisabled(true);
    setLoadingIds([temporaryTodo.id]);

    const createTodos = async () => {
      try {
        const createPost = await createTodo(newTodo);
        const addTodo = [...todos, createPost];

        setTodos(addTodo);
        // setTodos(prevTodo => [...prevTodo, createPost]); // працює
      } catch (error) {
        isError = true;
        setErrorMessage('Unable to add a todo');
      } finally {
        setFocused(new Date());
        setIdDisabled(false);
        setTempTodo(null);
        setLoadingIds([]);
        hideMessage();

        if (!isError) {
          setTitle('');
        }
      }
    };

    createTodos();

    isError = false;
  };

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: everyCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggle(todos, !everyCompleted)}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          ref={focus}
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
        />
      </form>
    </>
  );
};
