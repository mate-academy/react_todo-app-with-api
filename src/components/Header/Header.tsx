/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Error } from '../../types/enums/Error';
import { addTodo, updateTodo } from '../../api/todos';
import { USER_ID } from '../../Variables';
import { DispatchContext, StateContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';

export const Header: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const addTodoInput = useRef<null | HTMLInputElement>(null);

  const completedTodos = todos?.filter(({ completed }) => completed);
  const notCompletedTodos = todos?.filter(({ completed }) => !completed);
  const isActiveToggleAll = completedTodos.length === todos.length;
  const todosToggleAll = isActiveToggleAll ? completedTodos : notCompletedTodos;

  useEffect(() => {
    addTodoInput.current?.focus();
  }, [todoTitle]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todoTitle.trim()) {
      setDisableInput(true);
      dispatch({
        type: ReducerType.SetTempTodo,
        payload: {
          id: 0,
          userId: USER_ID,
          title: todoTitle.trim(),
          completed: false,
        },
      });

      addTodo(USER_ID, {
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      })
        .then((todo) => {
          dispatch({
            type: ReducerType.AddTodo,
            payload: todo,
          });
          setTodoTitle('');
        })
        .catch(() => dispatch({
          type: ReducerType.SetError,
          payload: Error.UnableToAddATodo,
        }))
        .finally(() => {
          setDisableInput(false);

          dispatch({
            type: ReducerType.SetTempTodo,
            payload: null,
          });
        });
    } else {
      dispatch({
        type: ReducerType.SetError,
        payload: Error.TitleShouldNotBeEmpty,
      });
    }
  };

  const handleToggleAll = () => {
    Promise.all(
      todosToggleAll.map((todo) => updateTodo(
        todo.id,
        { ...todo, completed: !isActiveToggleAll },
      )),
    )
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnableToUpdateATodo,
      }))
      .finally(() => todosToggleAll.map(todo => dispatch({
        type: ReducerType.ChangeTodo,
        payload: { ...todo, completed: !isActiveToggleAll },
      })));
  };

  return (
    <header className="todoapp__header">
      {
        !!todos.length && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isActiveToggleAll,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />
        )
      }

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={addTodoInput}
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
