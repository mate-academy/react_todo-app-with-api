import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { TodosContext, ApiErrorContext, FormFocusContext } from '../../Context';
import { Form } from '../Form';
import USER_ID from '../../helpers/USER_ID';
import { addTodo } from '../../api/todos';
import { postTodoAction } from '../../Context/actions/actionCreators';
import { emptyInputError } from '../../types/apiErrorsType';

// Component
export const Header: React.FC = () => {
  const { todos, setTempTodo, dispatch } = useContext(TodosContext);
  const { isFocused } = useContext(FormFocusContext);
  const { setApiError } = useContext(ApiErrorContext);
  const ref = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const isToggleVisible = todos.length > 0;
  const isToggleActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (ref.current && isFocused) {
      ref.current.focus();
    }
  }, [ref, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preparedInputValue = inputValue.trim();

    if (!preparedInputValue.length) {
      setApiError(new Error(emptyInputError));

      return;
    }

    const data = {
      userId: USER_ID,
      title: preparedInputValue,
      completed: false,
    };

    setTempTodo({ ...data, id: 0 });

    if (ref.current) {
      ref.current.blur();
      ref.current.disabled = true;
    }

    addTodo(data)
      .then((newTodo) => {
        const actionPost = postTodoAction(newTodo);

        dispatch(actionPost);
        setInputValue('');
      })
      .catch(error => setApiError(error))
      .finally(() => {
        setTempTodo(null);

        if (ref.current && isFocused) {
          ref.current.disabled = false;
          ref.current.focus();
        }
      });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      {isToggleVisible && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleActive,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <Form
        forCypress="NewTodoField"
        ref={ref}
        placeholder="What needs to be done?"
        onInputChange={handleInputChange}
        value={inputValue}
        onSubmit={handleSubmit}
      />
    </header>
  );
};
