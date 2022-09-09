import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (v: number) => void;
  setTodos: (v: Todo[]) => void;
  changeStatusTodo: (v: number, v2: boolean) => void;
  selectedId: number;
  setSelectedId: (v: number) => void;
  title: string;
  setTitle: (v: string) => void;
  changeTitleTodo: () => void;
};

export const TodoList: React.FC<Props> = React.memo(
  (props) => {
    const {
      todos,
      removeTodo,
      setTodos,
      changeStatusTodo,
      selectedId,
      setSelectedId,
      title,
      setTitle,
      changeTitleTodo,
    } = props;

    return (
      <>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            setTodos={setTodos}
            changeStatusTodo={changeStatusTodo}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            title={title}
            setTitle={setTitle}
            changeTitleTodo={changeTitleTodo}
          />
        ))}
      </>
    );
  },
);
