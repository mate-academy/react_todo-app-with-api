import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AddingTodo, Todo } from '../../types/Todo';
import { MyContext, MyContextData } from '../context/myContext';
import { USER_ID, addTodo, updateTodo } from '../../api/todos';

export const CustomHeader: React.FC = () => {
  const {
    reducer,
    query,
    inputRef,
    focusField,
    handleSetError,
    handleSetQuery,
    handleSetLoading,
    createTempTodo,
  } = useContext(MyContext) as MyContextData;

  const { state, addItem, toggle } = reducer;
  const allTodosCompleted = state.every((elem: Todo) => elem.completed);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    focusField();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetError('');

    if (query.trim() !== '') {
      const obj: AddingTodo = {
        title: query.trim(),
        userId: USER_ID,
        completed: false,
      };

      setIsAdding(true);
      createTempTodo(true);
      addTodo(obj)
        .then(todo => {
          setIsAdding(false);
          handleSetQuery('');
          createTempTodo(false);
          addItem(todo);
        })
        .catch(() => {
          setIsAdding(false);
          createTempTodo(false);
          handleSetError('Unable to add a todo');
        })
        .finally(() => {
          setTimeout(() => {
            focusField();
          }, 0);
        });
    } else {
      handleSetError('Title should not be empty');
    }
  };

  const toggleAll = () => {
    let completedStatus = false;

    if (state.find((todo: Todo) => !todo.completed)) {
      completedStatus = true;
    }

    handleSetLoading([...state]);
    state.forEach((todo: Todo) => {
      // handleSetLoading([...loading, todo]);
      updateTodo(todo.id, { completed: completedStatus })
        .then(() => {
          handleSetLoading([]);

          // toggling the todo only if it needded
          if (todo.completed !== completedStatus) {
            toggle(todo.id);
          }
        })
        .catch(() => {
          handleSetError('Unable to update a todo');
        });
    });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSetQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={() => toggleAll()}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
