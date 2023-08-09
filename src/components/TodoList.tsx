import React from 'react';
import { Todo } from '../types/Todo';
import '../styles/todo.scss';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  handleDelete: (id : number) => void;
  changeStatus: (todo: Todo) => void;
  changeTitle: (todo: Todo, editedTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos, handleDelete, changeStatus, changeTitle,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDelete={handleDelete}
          changeStatus={() => changeStatus(todo)}
          changeTitle={(
            editTodo: Todo, editedTitle: string,
          ) => changeTitle(editTodo, editedTitle)}
        />
      ))}
    </>
  );
};
