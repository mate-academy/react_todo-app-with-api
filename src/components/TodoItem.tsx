import { useState } from 'react';
import classNames from 'classnames';
import { Checkbox } from './ItemComponents/Checkbox';
import { TodoTitle } from './ItemComponents/TodoTitle';
import { DeleteButton } from './ItemComponents/DeleteButton';
import { UpdateForm } from './ItemComponents/UpdateForm';
import { Loader } from './ItemComponents/Loader';
import { Todo } from '../types/Todo';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <Checkbox todo={todo} />

      {isEdit ? (
        <UpdateForm
          todo={todo}
          setIsEdit={setIsEdit}
        />
      ) : (
        <>
          <TodoTitle
            title={todo.title}
            onEdit={setIsEdit}
          />
          <DeleteButton id={todo.id} />
        </>
      )}
      <Loader id={todo.id} />
    </div>
  );
};
