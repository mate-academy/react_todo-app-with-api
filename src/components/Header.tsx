import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { showError } from '../helpers/helpers';
import { updateTodo, addTodos } from '../api/todos';

interface Props {
  todos: Todo[],
  setSearchQuery: (SearchQuery: string) => void;
  searchQuery: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: (tempTodo: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoader: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  setSearchQuery,
  searchQuery,
  setError,
  setTempTodo,
  setTodos,
  setLoader,
}) => {
  const [submitDisable, setSubmitDisable] = useState(false);
  const activeInputButton = todos.every(todo => todo.completed);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    (setSearchQuery(event.target.value));
  };

  const newTodo = {
    id: 0,
    title: searchQuery,
    userId: 10881,
    completed: false,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitDisable(true);
    if (!searchQuery) {
      showError('Title can\'t be empty', setError);
      setSubmitDisable(false);
    } else {
      addTodos(10881, searchQuery)
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

  const handleClick = () => {
    if (activeInputButton) {
      todos.forEach(todo => {
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
      });
    } else {
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
    }
  };

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            aria-label="complete all tasks"
            type="button"
            onClick={handleClick}
            className={cn('todoapp__toggle-all', {
              active: activeInputButton,
            })}
          />
        )
      }

      {/* Add a todo on form submit */}
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
