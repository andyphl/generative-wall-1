const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  suffix: random.getSeed(),
  dimensions: [2048, 2048],
};

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

interface Props {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  playhead: number;
}

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes));

  function createGrid(count: number) {
    const points: {
      position: [number, number];
      connectWith: [number, number];
      radius: number;
      color: string;
    }[] = [];

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const connectU =
          count <= 1 ? 0.5 : random.rangeFloor(1, count) / (count - 1);
        const connectV =
          count <= 1 ? 0.5 : random.rangeFloor(1, count) / (count - 1);
        points.push({
          position: [u, v],
          connectWith: [connectU, connectV],
          radius: 30,
          color: random.pick(palette),
        });
      }
    }
    return points;
  }

  const count = 6;
  const margin = 200;
  const points = createGrid(count);

  return ({ context, width, height, playhead }: Props) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(
      ({
        position: [u, v],
        radius,
        connectWith: [connectU, connectV],
        color,
      }) => {
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v);
        const connectX = lerp(margin, width - margin, connectU);
        const connectY = lerp(margin, height - margin, connectV);

        // context.beginPath();
        // context.arc(x, y, radius, 0, Math.PI * 2, false);
        // context.fillStyle = "black";
        // context.fill();

        const region = new Path2D();
        region.moveTo(x, y);
        region.lineTo(x, lerp(margin, height - margin, 1));
        region.lineTo(connectX, lerp(margin, height - margin, 1));
        region.lineTo(connectX, connectY);
        region.lineTo(x, y);
        region.closePath();

        context.fillStyle = color;
        context.fill(region, "evenodd");
        context.strokeStyle = "white";
        context.lineWidth = 20;
        context.stroke(region);
      }
    );
  };
};

canvasSketch(sketch, settings);
