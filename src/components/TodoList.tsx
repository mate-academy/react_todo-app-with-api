import React, { Dispatch, SetStateAction, useState } from 'react';

import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  filteredTodos: Todo[];
  changeComplete: (todo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setIsDeleted: (isDeleted: boolean) => void;
  setErrorMessage: (error: ErrorMessage) => void;
  todosForDelete: Todo[];
  editedTodos: Todo[];
};

const TodoList: React.FC<Props> = ({
  filteredTodos,
  changeComplete,
  setTodos,
  tempTodo,
  setIsDeleted,
  setErrorMessage,
  todosForDelete,
  editedTodos,
}) => {
  const [todoIdInEditMode, setTodoIdInEditMode] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            changeComplete={changeComplete}
            setTodos={setTodos}
            setIsDeleted={setIsDeleted}
            setErrorMessage={setErrorMessage}
            todosForDelete={todosForDelete}
            editedTodos={editedTodos}
            isInEdit={todo.id === todoIdInEditMode}
            setEditMode={setTodoIdInEditMode}
          />
        ))}
        {tempTodo && <TempTodo tempTodo={tempTodo} />}
      </>
    </section>
  );
};

export default React.memo(TodoList);
