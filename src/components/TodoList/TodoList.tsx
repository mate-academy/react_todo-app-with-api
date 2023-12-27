import React from 'react';
import { Todo as TodoInterface } from '../../types/Todo';
import { Todo } from '../Todo/Todo';
import { Errors } from '../../types/Errors';

interface Props {
  todos: TodoInterface[],
  tempTodo: Omit<TodoInterface, 'userId'> | null,
  handleDelete: (todoId: number) => void,
  selectedTodos: number[],
  toggleComplete: (
    todoId: number,
    { completed }: Pick<TodoInterface, 'completed'>,
  ) => void,
  editTodoTitle: (editingTodoId: number) => void,
  editableTodo: TodoInterface | null,
  setEditableTodo: React.Dispatch<React.SetStateAction<TodoInterface | null>>,
  handleError: (err: Errors) => void,
  setSelectedTodos: React.Dispatch<React.SetStateAction<number[]>>,
  setTodos: React.Dispatch<React.SetStateAction<TodoInterface[]>>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete = () => { },
  selectedTodos,
  toggleComplete,
  editTodoTitle,
  editableTodo,
  setEditableTodo,
  handleError,
  setSelectedTodos,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({
        title,
        id,
        completed,
      }) => (
        <Todo
          id={id}
          title={title}
          completed={completed}
          key={id}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          onClick={toggleComplete}
          editTodoTitle={() => editTodoTitle(id)}
          editableTodo={editableTodo}
          setEditableTodo={setEditableTodo}
          handleError={handleError}
          setSelectedTodos={setSelectedTodos}
          setTodos={setTodos}
        />
      ))}
      {tempTodo
        && (
          <Todo
            id={tempTodo.id}
            title={tempTodo.title}
            completed={tempTodo.completed}
            handleDelete={() => { }}
            selectedTodos={selectedTodos}
            onClick={() => { }}
            editTodoTitle={() => { }}
            editableTodo={editableTodo}
            setEditableTodo={() => { }}
            handleError={handleError}
            setTodos={setTodos}
            setSelectedTodos={() => { }}
          />
        )}
    </section>
  );
};
