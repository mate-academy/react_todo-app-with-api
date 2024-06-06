import { useContext, useEffect, useRef, useState, FC } from 'react';
import { DispatchContext, StateContext } from '../../store/todoReducer';
import { Todo } from '../../types/Todo';
import { Action } from '../../types/actions';
import { USER_ID, createTodo, updateTodo } from '../../api/todos';

type Props = {
  onError: (value: string) => void;
  setTempTodo: (value: Todo | null) => void;
};

export const Header: FC<Props> = ({ onError, setTempTodo }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todos, addingTodo]);

  const isAllTodoComplete = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddingTodo(true);

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');
      setAddingTodo(false);

      return;
    }

    const newTodo: Todo = {
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(response => {
        dispatch({ type: Action.addTodo, payload: response });
        setTempTodo(null);
        setTodoTitle('');
      })
      .catch(() => {
        onError('Unable to add a todo');
        setTempTodo(null);
        setAddingTodo(false);
      })
      .finally(() => setAddingTodo(false));
  };

  const handleStatusChange = () => {
    const isAllComplete = todos.every(todo => todo.completed);

    let newTodoList;

    if (isAllComplete) {
      newTodoList = todos;
    } else {
      newTodoList = todos.filter(todo => !todo.completed);
    }

    newTodoList.forEach(todo => {
      updateTodo(todo.id, { completed: !todo.completed })
        .then(() => {
          dispatch({
            type: Action.updateTodo,
            payload: { id: todo.id, data: { completed: !todo.completed } },
          });
        })
        .catch(() => onError('Unable to update a todo'));
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllTodoComplete && 'active'}`}
          data-cy="ToggleAllButton"
          onClick={handleStatusChange}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={todoTitle}
          {...(addingTodo && { disabled: true })}
          ref={titleRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
