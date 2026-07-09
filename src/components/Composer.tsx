import type { WorkspacePrimitiveComponent } from './shared';

export const Composer: WorkspacePrimitiveComponent = () => (
  <form className="workspace-chat-input" aria-label="Chat composer">
    <button className="workspace-chat-input__icon" type="button" aria-label="Add context">
      +
    </button>
    <input type="text" placeholder="Ask Anything" aria-label="Ask Anything" />
    <button className="workspace-chat-input__icon" type="button" aria-label="Voice input">
      ◦
    </button>
    <button className="workspace-chat-input__send" type="button" aria-label="Send message">
      ↑
    </button>
  </form>
);
