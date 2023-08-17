/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isActiveLoaderTodos: number[];
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (id: number, completed: boolean) => Promise<void>;
  onChangeTodo: (id: number, title: string) => Promise<void>;
  onChangeOrder: (list: Todo[]) => void;
};

const TRANSTION_DURATION = 300;

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isActiveLoaderTodos,
  onDeleteTodo,
  onToggleTodo,
  onChangeTodo,
  onChangeOrder,
}) => {
  const [orderedTodosTemp, setOrderedTodosTemp] = useState<Todo[]>([]);
  const todosContainer = useRef<HTMLDivElement | null>(null);
  const [todosItems, setTodosItems] = useState<HTMLElement[]>([]);
  const [isTempSortedItem, setIsTempSortedItem] = useState<boolean>(false);
  const [draggableIndex, setDraggableIndex]
    = useState<number>(-1);
  const [dragTargetTodoIndex, setDragTargetTodoIndex] = useState<number>(-1);

  const isActiveLoaderTodo = (id: number): boolean => {
    return isActiveLoaderTodos.includes(id);
  };

  useEffect(() => {
    if (todosContainer.current) {
      const container = todosContainer.current.childNodes;
      const itemsNode: NodeListOf<ChildNode> = container[0].childNodes;
      const items = Object.values(itemsNode) as HTMLElement[];

      setTodosItems(items);
    }

    if (orderedTodosTemp.length > 0) {
      setIsTempSortedItem(true);

      todosItems.forEach(todo => {
        todo.style.transform = 'TranslateY(0px)';
      });

      setOrderedTodosTemp([]);
    }
  }, [todos]);

  useEffect(() => {
    if (orderedTodosTemp.length > 1) {
      onChangeOrder(orderedTodosTemp);
    }

    if (orderedTodosTemp.length === 0) {
      setTimeout(() => {
        setIsTempSortedItem(false);
      }, TRANSTION_DURATION + 50);
    }
  }, [orderedTodosTemp]);

  const showTemporarySortedList = (sortedTodos: Todo[]) => {
    setTimeout(() => {
      setOrderedTodosTemp(sortedTodos);
    }, TRANSTION_DURATION);
  };

  const onDragStart = (index: number) => {
    setDraggableIndex(index);
  };

  const onDragEnd = () => {
    setDraggableIndex(-1);
  };

  const onDragEnter = (indexT: number) => {
    setDragTargetTodoIndex(indexT);
  };

  const onDragDrop = (indexTarget: number) => {
    if (dragTargetTodoIndex === draggableIndex) {
      setDragTargetTodoIndex(-1);
      setDraggableIndex(-1);

      return;
    }

    todosItems.forEach((todo, i) => {
      const todoHeight = todo.getBoundingClientRect().height;

      if (dragTargetTodoIndex > draggableIndex) {
        if (i === draggableIndex) {
          const diff = dragTargetTodoIndex - draggableIndex;

          todo.style.transform = `TranslateY(${diff * todoHeight}px)`;
        }

        if (i > draggableIndex && i <= dragTargetTodoIndex) {
          todo.style.transform = `TranslateY(-${todoHeight}px)`;
        }
      }

      if (dragTargetTodoIndex < draggableIndex) {
        if (i === draggableIndex) {
          const diff = dragTargetTodoIndex - draggableIndex;

          todo.style.transform = `TranslateY(${diff * todoHeight}px)`;
        }

        if (i < draggableIndex && i > dragTargetTodoIndex - 1) {
          todo.style.transform = `TranslateY(${todoHeight}px)`;
        }
      }
    });

    const tempTodos = [...todos].filter(
      (_, index) => index !== draggableIndex,
    );

    tempTodos.splice(indexTarget, 0, todos[draggableIndex]);

    setDragTargetTodoIndex(-1);
    setDraggableIndex(-1);
    showTemporarySortedList(tempTodos);
  };

  return (
    <div ref={todosContainer} className="container">
      <TransitionGroup>
        {todos.map((todo, index) => (
          <CSSTransition
            key={todo.id}
            in={!!todo.id}
            appear
            unmountOnExit
            timeout={TRANSTION_DURATION}
            classNames="todo"
          >
            <TodoItem
              todo={todo}
              index={index}
              hasLoader={isActiveLoaderTodo(todo.id)}
              onDeleteTodo={onDeleteTodo}
              onToggleTodo={onToggleTodo}
              onChangeTodo={onChangeTodo}
              onDragStart={() => onDragStart(index)}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              onDragDrop={onDragDrop}
              draggableIndex={draggableIndex}
              dragTargetIndex={dragTargetTodoIndex}
              isTempSortedItem={isTempSortedItem}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {orderedTodosTemp.length > 0 && (
        <div className="todo-list-temp">
          {orderedTodosTemp.map(todo => (
            <div
              key={todo.id}
              className={cn(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>
              <span
                className="todo__title"
              >
                {todo.title}
              </span>
            </div>
          ))}
        </div>
      )}
      <TransitionGroup>
        {tempTodo && (
          <CSSTransition
            timeout={TRANSTION_DURATION}
            classNames="todo-temp"
          >
            <TodoItem
              todo={tempTodo}
              index={0}
              hasLoader
              onDeleteTodo={onDeleteTodo}
              onToggleTodo={onToggleTodo}
              onChangeTodo={onChangeTodo}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnd}
              onDragDrop={onDragDrop}
              draggableIndex={draggableIndex}
              dragTargetIndex={dragTargetTodoIndex}
              isTempSortedItem={isTempSortedItem}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};
