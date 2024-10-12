import { Position, Size, Sprite } from "./components";
import { Entity } from "./entities";

export const drawEntities = (
  entities: Entity[],
  context: CanvasRenderingContext2D,
) => {
  entities
    .filter((entity) =>
      entity.components.find((component) => component instanceof Sprite),
    )
    .forEach((entity) => {
      const sprite = entity.components.find(
        (component) => component instanceof Sprite,
      );
      const position = entity.components.find(
        (component) => component instanceof Position,
      );
      const size = entity.components.find(
        (component) => component instanceof Size,
      );

      if (sprite && sprite.image && position && size) {
        context.drawImage(
          sprite.image,
          position.x,
          position.y,
          size.width,
          size.height,
        );
      }

      // If no sprite is found, draw a gray rectangle with the entity's ID
      else if (position && size) {
        context.fillStyle = "gray";
        context.fillRect(position.x, position.y, size.width, size.height);

        context.fillStyle = "white";
        context.fillText(entity.id, position.x, position.y + 16);
      }
    });
};
