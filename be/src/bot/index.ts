import { assignGroup } from "./handlers/assign.js";
import { keyVerify } from "./handlers/key.js";
import { sendMessage } from "./handlers/message.js";
import { rulesHandler } from "./handlers/rules.js";
import { startHandler } from "./handlers/start.js";

export const initBot = () => {
  // Register Handlers
  startHandler();
  sendMessage();
  rulesHandler();
  assignGroup();
  keyVerify();
};
