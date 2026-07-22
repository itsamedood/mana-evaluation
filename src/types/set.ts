import type Command from "./command";

export default interface Set {
  command: Command;
  buttons?: any[] | undefined;
  menus?: any[] | undefined;
  modals?: any[] | undefined;
}
