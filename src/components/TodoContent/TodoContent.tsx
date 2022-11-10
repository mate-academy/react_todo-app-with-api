import React from 'react';
import { TodoHeader } from '../TodoHeader';
import { TodoBody } from '../TodoBody';
import { TodoFooter } from '../TodoFooter';

import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[],
  countOfTodos: number,
  countOfLeftTodos: number,
  hasComplited: boolean,
  visibleTodos: Todo[],
  filterTodos: (filterBy: FilterStatus) => void;
  filterStatus: FilterStatus,
  onChangeTitle: (title: string) => void;
  todoTitle: string;
  createNewTodo: (title: string) => void;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  proccessedTodoId: number[],
  changeCompleteStatus: (todoId: number, isComplited: boolean) => void;
  deleteAllCompletedTodos: () => void;
  copleteAllTodos: () => void;
  isEveryTodosComplited: boolean;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoContent: React.FC<Props> = React.memo(({
  newTodoField,
  todos,
  countOfTodos,
  countOfLeftTodos,
  hasComplited,
  visibleTodos,
  filterTodos,
  filterStatus,
  onChangeTitle,
  todoTitle,
  createNewTodo,
  isLoading,
  deleteTodo,
  proccessedTodoId,
  changeCompleteStatus,
  deleteAllCompletedTodos,
  copleteAllTodos,
  isEveryTodosComplited,
  changeTodoTitle,
}) => (
  <div className="todoapp__content">
    <TodoHeader
      countOfTodos={countOfTodos}
      newTodoField={newTodoField}
      onChangeTitle={onChangeTitle}
      todoTitle={todoTitle}
      createNewTodo={createNewTodo}
      isAdding={isLoading}
      copleteAllTodos={copleteAllTodos}
      isEveryTodosComplited={isEveryTodosComplited}
    />

    {todos.length > 0
      && (
        <>
          <TodoBody
            visibleTodos={visibleTodos}
            isLoading={isLoading}
            todoTitle={todoTitle}
            deleteTodo={deleteTodo}
            proccessedTodoId={proccessedTodoId}
            changeCompleteStatus={changeCompleteStatus}
            changeTodoTitle={changeTodoTitle}
          />

          <TodoFooter
            filterTodos={filterTodos}
            filterStatus={filterStatus}
            countOfLeftTodos={countOfLeftTodos}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
            hasComplited={!hasComplited}
          />
        </>
      )}
  </div>
));
