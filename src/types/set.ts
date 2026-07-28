import type Button from "./button";
import type Command from "./command";
import type Event from "./event";

export default interface Set {
  name: Command | Event;
  buttons?: Button[] | undefined;
  menus?: any[] | undefined;
  modals?: any[] | undefined;
}
