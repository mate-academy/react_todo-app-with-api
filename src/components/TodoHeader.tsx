import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';

import { USER_ID, createTodo, updateTodo } from '../api/todos';
import { TodoErrors } from '../types/TodoErrors';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContext';

export const TodoHeader: React.FC = () => {
  const { state, dispatch } = useContext(TodoContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const newTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    newTodoRef.current?.focus();
  }, [state.todos.length, state.tempTodo]);

  const handleToggleAll = useCallback(async () => {
    const areSomeTodosNotCompleted = state.todos.some(todo => !todo.completed);
    const notCompletedTodos = state.todos.filter(todo => !todo.completed);

    if (areSomeTodosNotCompleted) {
      notCompletedTodos.map(todo =>
        dispatch({ type: 'SET_LOADER', id: todo.id }),
      );
    } else {
      state.todos.map(todo => dispatch({ type: 'SET_LOADER', id: todo.id }));
    }

    try {
      if (areSomeTodosNotCompleted) {
        for (const todo of notCompletedTodos) {
          await updateTodo({
            ...todo,
            completed: true,
          });
        }
      } else {
        for (const todo of state.todos) {
          await updateTodo({
            ...todo,
            completed: areSomeTodosNotCompleted,
          });
        }
      }

      dispatch({ type: 'TOGGLE_ALL' });
    } catch {
      dispatch({ type: 'SET_ERROR', error: TodoErrors.UPDATE_TODO });
    }

    state.todos.map(todo => dispatch({ type: 'REMOVE_LOADER', id: todo.id }));
  }, [state.todos, dispatch]);

  const handleNewTodoSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (newTodoTitle.trim()) {
        const todo: Todo = {
          id: 0,
          title: newTodoTitle.trim(),
          completed: false,
          userId: USER_ID,
        };

        dispatch({
          type: 'SET_TEMP_TODO',
          title: todo.title,
        });

        try {
          const newTodo = await createTodo(todo);

          dispatch({ type: 'ADD_TODO', title: newTodo.title, id: newTodo.id });
          setNewTodoTitle('');
          dispatch({
            type: 'DELETE_TEMP_TODO',
          });
        } catch {
          dispatch({ type: 'SET_ERROR', error: TodoErrors.ADD_TODO });
          dispatch({
            type: 'DELETE_TEMP_TODO',
          });
        }
      } else {
        dispatch({ type: 'SET_ERROR', error: TodoErrors.TITLE_EMPTY });
      }
    },
    [newTodoTitle, dispatch],
  );

  const handleNewTodoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(event.target.value);
    },
    [],
  );

  return (
    <header className="todoapp__header">
      {state.todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: state.todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleNewTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoChange}
          ref={newTodoRef}
          disabled={state.tempTodo !== null}
        />
      </form>
    </header>
  );
};
