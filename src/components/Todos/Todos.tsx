import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { UpdateToDo } from '../UpdateTodo/updateTodo';
import { RemoveButton } from '../RemoveTodos/RemoveTodo';
import classNames from 'classnames';
import { Complete } from '../Complete/Complete';
import { CallUpdatingForm } from '../callUpdatingForm/callUpdatingForm';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  handleAutofocus: (isEnabled: boolean) => void;
  loader: number | null;
  setLoader: React.Dispatch<React.SetStateAction<number | null>>;
};

export const Todos: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMesage,
  handleAutofocus,
  loader,
  setLoader,
}) => {
  const id = todo.id ?? null;

  const [callUpdatingForm, setCallUpdatingForm] = useState<number | null>(null);
  const [oldValue, setOldValueToUpdatingForm] = useState<string>('');
  const todoCompleted = todo.completed;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoCompleted,
      })}
    >
      {
        <Complete
          todo={todo}
          setTodos={setTodos}
          setErrorMesage={setErrorMesage}
          setLoader={setLoader}
        />
      }
      {callUpdatingForm !== id && (
        <CallUpdatingForm
          setCallUpdatingForm={setCallUpdatingForm}
          todo={todo}
          setOldValueToUpdatingForm={setOldValueToUpdatingForm}
          setLoader={setLoader}
        />
      )}

      {callUpdatingForm !== id && (
        <RemoveButton
          todo={todo}
          setTodos={setTodos}
          setErrorMesage={setErrorMesage}
          handleAutofocus={handleAutofocus}
          setLoader={setLoader}
        />
      )}
      {callUpdatingForm === id && (
        <UpdateToDo
          oldValue={oldValue}
          setCallUpdatingForm={setCallUpdatingForm}
          todo={todo}
          setTodos={setTodos}
          setErrorMesage={setErrorMesage}
          setLoader={setLoader}
        />
      )}
      <Loader id={id} loader={loader} />
    </div>
  );
};
