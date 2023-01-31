import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

export type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  isRenamingTodo: boolean;
  setIsRenamingTodo: Dispatch<SetStateAction<boolean>>;
  selectedTodoById: number;
  dblClickHandler: (id: number) => void;
  updateTitleTodo: (value: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodo,
  isRenamingTodo,
  setIsRenamingTodo,
  selectedTodoById,
  dblClickHandler,
  updateTitleTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          // ============================
          isRenamingTodo={isRenamingTodo}
          setIsRenamingTodo={setIsRenamingTodo}
          selectedTodoById={selectedTodoById}
          dblClickHandler={dblClickHandler}
          updateTitleTodo={updateTitleTodo}
        />
      ))}
    </section>
  );
};
