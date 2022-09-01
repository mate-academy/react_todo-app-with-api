/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  Dispatch, SetStateAction,
  memo, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { createTodo, updateTodoById } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  todos: Todo[];
  loading: boolean;
  lengthCompleted: number;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onLoading: (loading: boolean) => void;
  onError: (errorMessage: string) => void;
  onSelected: (todoId: number | null) => void;
  onChanged: (ids: number[]) => void;
}

export const HeaderTodo = memo<Props>((props) => {
  const {
    todos,
    loading,
    lengthCompleted,
    setTodos,
    onError,
    onLoading,
    onSelected,
    onChanged,
  } = props;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // ** as soon as start the application immediately focuses on the newTodoField ** //
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  // ** creating new todo and sending it to the server ** //
  const addTodo = useCallback(() => {
    if (!newTitle.trim()) {
      onError('Title can\'t be empty');
      setIsSubmit(false);

      return;
    }

    if (user) {
      const newTodo = {
        id: -Infinity,
        userId: user.id,
        title: newTitle,
        completed: false,
      };

      onLoading(true);
      onSelected(newTodo.id);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      createTodo({
        title: newTitle,
        userId: user.id,
        completed: false,
      }).then(res => {
        setTodos(prev => prev.map(todo => {
          const result = todo;

          if (todo === newTodo) {
            result.id = res.id;
          }

          return result;
        }));
        onSelected(res.id);
      }).catch(() => {
        setTodos(prev => prev.slice(0, -1));
        onError('Unable to add a todo');
      }).finally(() => {
        setNewTitle('');
        onLoading(false);
        setIsSubmit(false);
      });
    }
  }, [isSubmit]);

  // ** toggle all todo completed or uncompleted **//
  const toggleAllTodo = useCallback(() => {
    const changedTodoId: number[] = [];
    const toggled = todos.some(todo => !todo.completed);

    if (toggled) {
      todos.forEach(todo => {
        if (!todo.completed) {
          changedTodoId.push(todo.id);
        }
      });
    } else {
      todos.forEach(todo => {
        changedTodoId.push(todo.id);
      });
    }

    const requests = changedTodoId.map(id => updateTodoById(id, {
      completed: toggled,
    }));

    onSelected(null);
    onChanged(changedTodoId);
    onLoading(true);
    Promise.all(requests)
      .then(res => setTodos(prev => prev.map(todo => {
        if (changedTodoId.includes(todo.id)) {
          const newTodo = res.find(resTodo => resTodo.id === todo.id);

          return newTodo || todo;
        }

        return todo;
      })))
      .catch(() => onError('Unable to update a todo'))
      .finally(() => {
        onLoading(false);
        onChanged([]);
      });
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.length === lengthCompleted },
          )}
          onClick={toggleAllTodo}
          disabled={loading}
        />
      )}

      <form onSubmit={(event) => {
        event.preventDefault();
        addTodo();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              setIsSubmit(true);
            }
          }}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
});
