import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { postTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodosContext } from '../TodosContext';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const {
    todos, setTodos, userId, setErrorMessage, setTempTodo, setLoadingTodoId,
  } = useContext(TodosContext);
  const [title, setTitile] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  function addTodo() {
    if (title.trim().length === 0) {
      setErrorMessage(ErrorType.emptyTitleError);
      setTimeout(() => {
        setErrorMessage(ErrorType.noError);
        setIsPosting(false);
      }, 3000);
    } else {
      setLoadingTodoId([0]);
      setTempTodo({
        id: 0, userId, title, completed: false,
      });
      postTodo({ userId, title, completed: false })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitile('');
        })
        .catch(() => setErrorMessage(ErrorType.addError))
        .finally(() => {
          setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
          setIsPosting(false);
          setLoadingTodoId([]);
          setTempTodo(null);
        });
    }
  }

  const handleCompleteAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    Promise.all<Promise<Todo>[]>(
      todos.map(todo => {
        return updateTodo({ ...todo, completed: !isAllCompleted });
      }),
    )
      .then((value) => setTodos(value))
      .catch(() => setErrorMessage(ErrorType.updateError))
      .finally(() => {
        setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitile(e.target.value);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        aria-label="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleCompleteAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={submit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isPosting}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
