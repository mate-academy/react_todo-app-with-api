import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  onDeleteTodo: (value: number) => void,
  title: string,
  changeTodo: (id: number, data: Partial<Todo>) => Promise<void>,
  setSelectId: React.Dispatch<React.SetStateAction<number>>,
  selectId: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  onDeleteTodo,
  title,
  changeTodo,
  setSelectId,
  selectId,
}) => {
  const tempTodo = {
    id: selectId,
    title,
    completed: false,
    userId: 0,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isAdding={isAdding}
          onDeleteTodo={onDeleteTodo}
          changeTodo={changeTodo}
          setSelectId={setSelectId}
          selectId={selectId}
        />
      ))}
      {isAdding && (
        <TodoItem
          todo={tempTodo}
          isAdding={isAdding}
          onDeleteTodo={onDeleteTodo}
          changeTodo={changeTodo}
          setSelectId={setSelectId}
          selectId={selectId}
        />
      )}
    </section>
  );
};
