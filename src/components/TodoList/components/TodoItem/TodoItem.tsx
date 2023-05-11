import classNames from 'classnames';
import { memo, FC, useState } from 'react';
import { Checkbox } from '../../../Checkbox';
import { TodoItemModal } from '../TodoItemModal';
import { TodoItemContent } from '../TodoItemContent';
import { TodoItemField } from '../TodoItemField';
import { KeyUp, MultiSubmit, GetValue } from '../../../../types/functions';
import { TodoProps } from '../../../../types/TodoItemProps';

export const TodoItem: FC<TodoProps> = memo(({
  todo,
  tempId,
  loading = false,
  completeTodo = () => {},
  removeTodo = () => {},
  renameTodo = () => {},
  updateTitle = () => {},
  setTempId = () => {},
}) => {
  const { id, title, completed } = todo;

  const [editTitle, setEditTitle] = useState(title);

  const onChange:GetValue = value => setEditTitle(value);

  const onSubmit: MultiSubmit = (e) => {
    e.preventDefault();

    if (!editTitle.length) {
      removeTodo(id);

      return;
    }

    updateTitle(todo, editTitle);
  };

  const resetTitleEdit: KeyUp = (e) => {
    if (e.key !== 'Escape') {
      return;
    }

    setTempId(0);
  };

  return (
    <div className={classNames('todo', { completed })}>
      <Checkbox
        todoInfo={todo}
        checked={completed}
        inputClassName="todo__status"
        labelClassName="todo__status-label"
        onChange={completeTodo}
      />
      {tempId === id ? (
        <TodoItemField
          value={editTitle}
          onKeyUp={resetTitleEdit}
          onSubmit={onSubmit}
          onChange={onChange}
        />
      ) : (
        <TodoItemContent
          id={id}
          title={title}
          handleRename={renameTodo}
          handleRemove={removeTodo}
        />
      )}

      <TodoItemModal loading={loading} />
    </div>
  );
});
