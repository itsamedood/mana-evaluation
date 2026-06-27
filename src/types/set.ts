import type Command from "./command";

export default interface Set {
  command: Command;

  // `any` is a placeholder until I make the appropriate classes.
  buttons?: any[] | undefined;
  menus?: any[] | undefined;
  modals?: any[] | undefined;
}
