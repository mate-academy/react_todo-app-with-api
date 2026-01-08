import React from 'react';
import classNames from 'classnames';
import { TodoItem } from '../todoItem/TodoItem';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo[];
  todoTemp: Todo | null;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  processingIds: number[];
  onToggleAll: () => void; // 1. Новая функция
  isAllCompleted: boolean; // 2. Новый флаг
};

export const TodoList: React.FC<Props> = ({
  todoList,
  todoTemp,
  deleteTodo,
  updateTodo,
  processingIds,
  onToggleAll,
  isAllCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* 3. Добавляем кнопку Toggle All */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={processingIds.includes(todo.id)}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={processingIds.includes(todoTemp.id)}
        />
      )}
    </section>
  );
};
