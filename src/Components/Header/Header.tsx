import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext } from '../../TodosContext';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

export const Header: React.FC = () => {
  const {
    errorMessage,
    setLoader,
    setLastTodo,
    todos,
    addTodo,
    setTodos,
    toggleTodoCompleted,
    setErrorMessage,
  } = useContext(TodosContext);

  const [toggleButton, setToggleButton] = useState(false);
  const [currentTitleValue, setCurrentTitlevalue] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!titleField.current) {
      titleField.current.focus();
      titleField.current.disabled = false;
    }
  }, [errorMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentTitleValue.trim().length === 0) {
      setErrorMessage('Title should not be empty');
      setCurrentTitlevalue('');
      if (titleField.current) {
        titleField.current.disabled = false;
      }

      return;
    }

    setLoader(true);

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    let newTodo: Todo | null;

    if (!!(titleField.current && titleField.current.value)) {
      newTodo = {
        id: new Date().getTime(),
        title: currentTitleValue.trim(),
        completed: false,
        userId: 478,
      };
      setLastTodo(newTodo);
    } else {
      newTodo = null;
    }

    if (newTodo && currentTitleValue.trim().length > 0 && titleField.current) {
      addTodo(newTodo, titleField.current).then(() => {
        setCurrentTitlevalue('');
        if (titleField.current) {
          titleField.current.disabled = false;
        }
      });
    }
  };

  const handleTitleChenger = () => {
    let updateTodos;

    if (todos.find(item => item.completed === false)) {
      setToggleButton(true);
      updateTodos = todos.map(todo => {
        toggleTodoCompleted(todo.id, false);

        return { ...todo, completed: true };
      });
    } else {
      setToggleButton(false);
      updateTodos = todos.map(todo => {
        toggleTodoCompleted(todo.id, true);

        return { ...todo, completed: false };
      });
    }

    setTodos(updateTodos);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: toggleButton,
        })}
        data-cy="ToggleAllButton"
        onClick={handleTitleChenger}
      />

      {/* Add a todo on form submit */}
      <form action="/" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={titleField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={currentTitleValue}
          onChange={event => {
            setCurrentTitlevalue(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
