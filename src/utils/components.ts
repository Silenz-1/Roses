import 
{ 
  InteractionButtonOptions, 
  MessageActionRow, 
  EmojiIdentifierResolvable, 
} from "discord.js";
import _ from "lodash";
import "lodash/assignIn.js";

const rows = new MessageActionRow();

type PickedButtonOptions = Required<Pick<InteractionButtonOptions, "style" | "type">>;


const PickedButtonOptions: PickedButtonOptions = {
  style: "SECONDARY",
  type: "BUTTON"
};

export function PushingButtons<T extends { customId: string; emoji: EmojiIdentifierResolvable }>
(_ops: T[]): MessageActionRow {
  const Buttons = _ops.map((buttonoption) => {
    return _.assignIn(buttonoption, PickedButtonOptions);
  });
  return rows.setComponents(Buttons)
}

export function disable(): MessageActionRow {
  for (const row of (rows.components)) {
    row.setDisabled(true);
  }
  return rows;
}