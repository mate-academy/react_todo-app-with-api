import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { postTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodosContext } from '../TodosContext';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const {
    todos, setTodos, userId, setErrorMassage, setTempTodo,
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
    setTempTodo({
      id: 0, userId, title, completed: false,
    });
    if (title.trim().length === 0) {
      setErrorMassage(ErrorType.EMPTY_TITLE);
      setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
    } else {
      postTodo({ userId, title, completed: false })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitile('');
        })
        .catch(() => setErrorMassage(ErrorType.ADD_ERROR))
        .finally(() => {
          setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
          setIsPosting(false);
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
      .catch(() => setErrorMassage(ErrorType.UPDATE_ERROR))
      .finally(() => {
        setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
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
