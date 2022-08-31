/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Dispatch, FC, LegacyRef, SetStateAction, useCallback,
} from 'react';
import { createTodo, editTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
  user: User,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setSelectedTodoIds: Dispatch<React.SetStateAction<number[]>>,
  selectedTodoIds: number[],
}

export const TodoForm: FC<Props> = (props) => {
  const {
    newTodoField,
    user,
    setErrorMessages,
    todoTitle,
    setTodoTitle,
    todos,
    setTodos,
    setSelectedTodoIds,
    selectedTodoIds,
  } = props;

  const clearInput = () => setTodoTitle('');

  const onAdd = useCallback((newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  }, [setTodos]);

  const onAddOptimistic = useCallback((todoOptimistic: Todo) => {
    setTodos((prevTodos) => [...prevTodos, todoOptimistic]);
  }, [setTodos]);

  const optimisticId = 0;

  const deleteOptimistic = useCallback(() => {
    setTodos((prevTodos) => prevTodos.filter(
      prevTodo => prevTodo.id !== optimisticId,
    ));
  }, [setTodos]);

  const submitHandler = () => {
    setErrorMessages([]);
    setSelectedTodoIds(prev => [...prev, optimisticId]);

    onAddOptimistic({
      title: todoTitle,
      id: optimisticId,
      userId: user.id,
      completed: false,
    });

    if (!todoTitle.trim().length) {
      setErrorMessages((prev: string []) => [...prev, 'Title can\'t be empty']);
      deleteOptimistic();
      clearInput();

      return;
    }

    createTodo({
      title: todoTitle,
      userId: user.id,
      completed: false,
    })
      .then(onAdd)
      .catch(() => {
        setErrorMessages(
          (prev: string []) => [...prev, 'Unable to add a todo'],
        );
      })
      .finally(() => {
        deleteOptimistic();
        clearInput();
        setSelectedTodoIds(prev => prev.filter(id => id !== optimisticId));
      });
  };

  const changeAllTodosStatus = useCallback(() => {
    const changedStatus = todos.some(({ completed }) => !completed);
    const todosToChange: number[] = [];

    todos.forEach(todo => {
      if (todo.id) {
        if (todo.completed !== changedStatus) {
          todosToChange.push(todo.id);
        }
      }
    });

    setSelectedTodoIds(prev => [...prev, ...todosToChange]);
    const updateTodos = (responce: Todo[]) => (
      setTodos(prev => (
        [...prev.filter(todo => !todosToChange.includes(todo.id)), ...responce]
      ))
    );

    Promise.all(
      todosToChange.map(id => (
        editTodo(id, { completed: changedStatus })
      )),
    )
      .then((responce) => updateTodos(responce))
      .catch(() => {
        setErrorMessages(
          (prev: string []) => [...prev, 'Unable to update a todo'],
        );
      })
      .finally(() => setSelectedTodoIds(prev => (
        prev.filter(id => selectedTodoIds.includes(id)))));
  }, [selectedTodoIds, setErrorMessages, setSelectedTodoIds, setTodos, todos]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={changeAllTodosStatus}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        submitHandler();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
