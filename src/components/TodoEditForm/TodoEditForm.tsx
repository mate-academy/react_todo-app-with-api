import React from 'react';
import { TodoMode } from '../../types/TodoMode';

type Props = {
  title: string,
  onTodoModeUpdate: (newMode: TodoMode) => void;
};

type State = {
  title: string | null;
};

export class TodoEditForm extends React.Component<Props, State> {
  state = {
    title: null,
  }

  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.title === null) {
      return {
        title: props.title,
      };
    }

    return null;
  }

  componentDidMount(): void {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    const { onTodoModeUpdate } = this.props;
    const title = this.state.title ?? '';

    return (
      <>
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(changeEvent) => this.setState({
              title: changeEvent.target.value,
            })}
            onKeyDown={(keyDownEvent => {
              if (keyDownEvent.code === '13') {
                onTodoModeUpdate(TodoMode.None);
              }
            })}
            onBlur={() => onTodoModeUpdate(TodoMode.None)}
            ref={this.inputRef}
          />
        </form>
      </>
    );
  }
}
