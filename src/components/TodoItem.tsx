import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from './TodoStatus';
import { TodoTitleField } from './TodoTitleField';

type Props = {
  todo: Todo,
  isAdding: boolean,
  onDeleteTodo: (value: number) => void,
  changeTodo: (id: number, data: Partial<Todo>) => Promise<void>,
  setSelectId: React.Dispatch<React.SetStateAction<number>>,
  selectId: number,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  onDeleteTodo,
  changeTodo,
  setSelectId,
  selectId,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        key={todo.id}
      >
        <TodoStatus
          todo={todo}
          changeTodo={changeTodo}
          setSelectId={setSelectId}
        />

        <TodoTitleField
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          setSelectId={setSelectId}
          changeTodo={changeTodo}
        />

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            {
              'is-active': (isAdding && todo.id === 0)
                || todo.id === selectId,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

      </div>
    </>
  );
};
