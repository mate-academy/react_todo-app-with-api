import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { createTodo, updateTodo } from '../../api/todos';
import { USER_ID } from '../../utils/variables';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const Header = () => {
  const {
    todos,
    setTodos,
    setAlarm,
    setTempTodo,
    isTodoChange,
    setIsTodoChange,
    setChangingItems,
  } = useContext(TodosContext);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isTodoChange]);

  const [inputValue, setInputValue] = useState('');

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
        setChangingItems([]);
      })
      .catch(() => {
        setAlarm(ErrorMessage.isUnableAddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsTodoChange(false);
      });
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInputValue = inputValue.trim();

    if (!trimmedInputValue) {
      setAlarm(ErrorMessage.isTitleEmpty);
      setInputValue('');

      return;
    }

    setChangingItems(current => [...current, 0]);
    setIsTodoChange(true);

    const newTodo = {
      title: trimmedInputValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });
    addTodo(newTodo);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setAlarm(ErrorMessage.Default);
  };

  const updateToggleTodoCompleted = (todo: Todo, val: boolean) => {
    const newTodo = {
      ...todo,
      completed: val,
    };

    setIsTodoChange(true);
    setChangingItems(current => [...current, todo.id]);
    updateTodo(newTodo)
      .then(() => {
        setIsTodoChange(false);
        setTodos(currentTodos => currentTodos
          .map(currTodo => {
            return currTodo.id !== newTodo.id
              ? currTodo
              : newTodo;
          }));
      })
      .catch(() => setAlarm(ErrorMessage.isUnableUpdateTodo))
      .finally(() => {
        setChangingItems([]);
      });
  };

  const handleAllCompletedTodos = () => {
    const notCompletedTodos = todos.filter(todo => !todo.completed);

    if (notCompletedTodos.length) {
      notCompletedTodos.forEach(todo => updateToggleTodoCompleted(todo, true));
    } else {
      todos.forEach(todo => updateToggleTodoCompleted(todo, false));
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllTodosCompleted },
          )}
          onClick={handleAllCompletedTodos}
        >
          {' '}
        </button>
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          value={inputValue}
          ref={titleInputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={isTodoChange}
        />
      </form>
    </header>
  );
};
