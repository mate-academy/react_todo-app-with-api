/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback } from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';
import { Error } from '../types/enumError';
import { deleteTodo, updateTodo } from '../api/todos';

type Props = {
  filteredTodos: Todo[];
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  loadingTodoId: number | null;
  tempTodo: Todo | null;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  loadingTodoId,
  tempTodo,
  setLoadingTodoId,
  setTodos,
  setErrorMessage,
  inputRef,
  setEditingTodoId,
  todos,
}) => {
  const deletePost = useCallback((todoId: number) => {
    setLoadingTodoId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
        setTimeout(() => setErrorMessage(Error.Default), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
        inputRef.current?.focus();
      });
  }, []);
  const updateTitle = useCallback(
    (todoId: number) => {
      const trimmedTitle = editingTitle.trim();
      const currentTodo = todos.find(todo => todo.id === todoId);

      if (currentTodo && trimmedTitle === currentTodo.title) {
        setEditingTodoId(null);

        return;
      }

      if (!trimmedTitle.length) {
        deletePost(todoId);
      } else {
        setLoadingTodoId(todoId);

        updateTodo(todoId, currentTodo?.completed || false, trimmedTitle)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(todo =>
                todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
              ),
            );
            setEditingTodoId(null);
          })
          .catch(() => {
            setErrorMessage(Error.Update);
            setTimeout(() => setErrorMessage(Error.Default), 3000);
          })
          .finally(() => {
            setLoadingTodoId(null);
          });
      }
    },
    [todos, editingTitle, deletePost],
  );

  const toggleCompleted = useCallback(
    (todoId: number) => {
      const currentTodo = todos.find(todo => todo.id === todoId);

      if (!currentTodo) {
        return;
      }

      const newCompletionState = !currentTodo.completed;

      setLoadingTodoId(todoId);

      updateTodo(todoId, newCompletionState, currentTodo.title)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === todoId
                ? { ...todo, completed: newCompletionState }
                : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(Error.Update);
          setTimeout(() => setErrorMessage(Error.Default), 3000);
        })
        .finally(() => {
          setLoadingTodoId(null);
        });
    },
    [todos, setTodos, updateTodo, setLoadingTodoId, setErrorMessage],
  );
  const handleCancelEdit = useCallback(() => {
    setEditingTodoId(null);
    setEditingTitle('');
  }, []);

  const handleEditTodo = useCallback((todoId: number, title: string) => {
    setEditingTodoId(todoId);
    setEditingTitle(title);
  }, []);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          togglCompleted={toggleCompleted}
          editingTitle={editingTitle}
          editingTodoId={editingTodoId}
          setEditingTitle={setEditingTitle}
          updateTitle={updateTitle}
          handleCancelEdit={handleCancelEdit}
          handleEditTodo={handleEditTodo}
          loadingTodoId={loadingTodoId}
          deletePost={deletePost}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
