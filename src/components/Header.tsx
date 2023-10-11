import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Types';
import { showError } from '../helpers/helpers';
import { updateTodo, addTodos, USER_ID } from '../api/todos';

interface Props {
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: (tempTodo: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoader: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  setError,
  setTempTodo,
  setTodos,
  setLoader,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submitDisable, setSubmitDisable] = useState(false);
  const activeInputButton = todos.every(todo => todo.completed);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    (setSearchQuery(event.target.value));
  };

  const newTodo = {
    id: 0,
    title: searchQuery,
    userId: USER_ID,
    completed: false,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitDisable(true);
    if (!searchQuery) {
      showError('Title can\'t be empty', setError);
      setSubmitDisable(false);
    } else {
      setLoader(prevState => [...prevState, newTodo.id]);
      addTodos(USER_ID, searchQuery)
        .then(todo => {
          setTodos(prevState => {
            setTempTodo(null);
            setSubmitDisable(false);
            setSearchQuery('');

            return [...prevState, todo];
          });
        })
        .catch(() => showError('Unable to add a todo', setError));
      setTempTodo(newTodo);
    }
  };

  const makeAllTodosActive = () => {
    todos.forEach(todo => {
      updateTodo(todo.id, { completed: !todo.completed })
        .then((updatedTodo) => {
          setTodos(prevState => (
            prevState.map(prevTodo => {
              return (prevTodo.id === todo.id) ? updatedTodo : prevTodo;
            })
          ));

          setLoader(prevState => prevState.filter(id => id !== todo.id));
        })
        .catch(() => showError('Unable to update a todo', setError));
    });
  };

  const makeActiveTodosCompleted = () => {
    todos.forEach(todo => {
      if (!todo.completed) {
        setLoader(prevState => [...prevState, todo.id]);
        updateTodo(todo.id, { completed: !todo.completed })
          .then((updatedTodo) => {
            setTodos(prevState => (
              prevState.map(prevTodo => {
                return (prevTodo.id === todo.id) ? updatedTodo : prevTodo;
              })
            ));

            setLoader(prevState => prevState.filter(id => id !== todo.id));
          })
          .catch(() => showError('Unable to update a todo', setError));
      }
    });
  };

  const handleCompleteTasksButtonClick = () => {
    if (activeInputButton) {
      makeAllTodosActive();
    } else {
      makeActiveTodosCompleted();
    }
  };

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            aria-label="complete all tasks"
            type="button"
            onClick={handleCompleteTasksButtonClick}
            className={cn('todoapp__toggle-all', {
              active: activeInputButton,
            })}
          />
        )
      }

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={handleChange}
          disabled={submitDisable}
        />
      </form>
    </header>
  );
};
