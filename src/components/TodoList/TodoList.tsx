import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { deleteTodo, modifyTodo } from '../../api/todos';
import { LoadDeleteContext } from '../../LoadDeleteContext';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  removeTodo,
  tempTodo,
}) => {
  const { setLoadDelete } = useContext(LoadDeleteContext);

  const updateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    const { checked } = event.target;

    setLoadDelete([todo.id]);
    modifyTodo(todo.id, { ...todo, completed: checked })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...todo,
                completed: checked,
              };
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        throw new Error('Unable to update todo');
      })
      .finally(() => setLoadDelete([]));
  };

  const clearTodo = (todo: Todo) => {
    setLoadDelete([todo.id]);
    deleteTodo(todo.id)
      .then(() => removeTodo(todo.id))
      .catch(() => 'Unable to delete todo')
      .finally(
        () => setLoadDelete([]),
      );
  };

  const editingTitle = (todo: Todo, title: string) => {
    setLoadDelete([todo.id]);

    modifyTodo(todo.id, { ...todo, title })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...prevTodo,
                title,
              };
            }

            return prevTodo;
          });
        });
      })
      .catch(() => 'Unable to edit todo')
      .finally(
        () => setLoadDelete([]),
      );
  };

  return (
    <ul className="todo-list">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              updateTodo={updateTodo}
              clearTodo={clearTodo}
              editingTitle={editingTitle}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={500}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
