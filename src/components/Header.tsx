import React, { Dispatch, SetStateAction } from 'react';
import { Form } from './Form';

import { Todo } from '../types/Todo';
import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todosCounter: number;
  changeCompleteAll: (todos: Todo[]) => void;
  setErrorMessage: (error: ErrorMessage) => void;
  addTempTodo: (todo: Todo | null) => void;
  isDeleted: boolean;
};

const Header: React.FC<Props> = ({
  todos,
  setTodos,
  todosCounter,
  changeCompleteAll,
  setErrorMessage,
  addTempTodo,
  isDeleted,
}) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={() => changeCompleteAll(todos)}
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !todosCounter,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <Form
        setTodos={setTodos}
        setErrorMessage={setErrorMessage}
        addTempTodo={addTempTodo}
        isDeleted={isDeleted}
      />
    </header>
  );
};

export default React.memo(Header);
