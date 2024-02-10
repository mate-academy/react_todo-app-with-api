/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { USER_ID } from '../../App';

import {
  ErrorsContext,
  LoadingContext,
  TodosContext,
} from '../../TodosContext/TodosContext';

import {
  checkAllStatuses,
  returnStatus,
} from '../../services/checkAllStatuses';
import { changeAllStatuses } from '../../services/changeAllStatuses';
import { ErrorMessages } from '../../types/Error';
import { reduceItems } from '../../services/reduceItems';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  onCompleted: (id: number, completeAll: boolean) => void;
};

export const InputForm: React.FC<Props> = ({ onSubmit, onCompleted }) => {
  const { todos, setTodos } = useContext(TodosContext);
  const { loading, startLoading } = useContext(LoadingContext);
  const {
    showError,
    newError,
    setNewError,
    setShowError,
  } = useContext(ErrorsContext);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [completeAll, setCompleteAll] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);
  const itemsLeft = reduceItems(todos, false);

  const handleChangeAll = () => {
    if (checkAllStatuses(todos)) {
      const isCompleted = returnStatus(todos);
      const changeAll = changeAllStatuses(todos, isCompleted);

      changeAll.forEach(todo => {
        const { id } = todo;

        startLoading(id);
        onCompleted(id, !isCompleted);
      });
    } else {
      todos.forEach(todo => {
        if (todo.completed === false) {
          const { id, completed } = todo;

          onCompleted(id, !completed);
          startLoading(id);
        }
      });
    }
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalizedTitle = newTodoTitle.trim();

    if (normalizedTitle === '') {
      setNewError(ErrorMessages.emptyTitle);
      setShowError(true);
      titleField.current?.focus();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    startLoading(0);
    setTodos((prev) => [...prev, newTodo]);
    await onSubmit(newTodo);
    setNewTodoTitle('');
  }

  useEffect(() => {
    titleField.current?.focus();
  }, [newTodoTitle]);

  useEffect(() => {
    if (newError === ErrorMessages.unableToAddTodo) {
      titleField.current?.focus();
    }

    if (newError === ErrorMessages.unableToAddTodo) {
      titleField.current?.focus();
    }
  }, [newError, showError]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${itemsLeft ? '' : 'active'}`}
        data-cy="ToggleAllButton"
        onClick={() => {
          handleChangeAll();
          setCompleteAll(!completeAll);
        }}
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={loading?.includes(0)}
          onChange={event => {
            setNewTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
