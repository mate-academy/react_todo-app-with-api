import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TodoItemLoad } from '../TodoItemLoad';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  isAdding: boolean,
  newText: string,
  deleteCompleted: boolean,
  updateCompleted: (todoId: number, data: {}) => void,
  actionAllCompleted: string,
  setAllCompleted: (state: 'allTrue' | 'allFalse' | '') => void,
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    removeTodo,
    isAdding,
    newText,
    deleteCompleted,
    updateCompleted,
    actionAllCompleted,
    setAllCompleted,
  },
) => {
  return (
    <>
      {
        todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            deleteCompleted={deleteCompleted}
            updateCompleted={updateCompleted}
            actionAllCompleted={actionAllCompleted}
            setAllCompleted={setAllCompleted}
          />
        ))
      }
      {isAdding && (
        <TodoItemLoad text={newText} />
      )}
    </>
  );
};
