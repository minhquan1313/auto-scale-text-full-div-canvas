const canvas = document.querySelector("canvas");
const target = document.getElementById("here");
const box = document.getElementById("box");

const gui = new dat.GUI();
const font = getComputedStyle(target).font.replace(/"/g, "");
const options = {
  width: target.clientWidth,
  height: target.clientHeight,
  x: 0,
  y: 0,
  text: target.innerText,
  fontSize: parseInt(font.split(" ")[0]),
  scaleWidth: true,
  showOriginal: true,
  opacity: 100,
};

gui.add(options, "text").onChange((e) => {
  target.innerText = e;
  draw();
});
gui.add(options, "fontSize", 0, 333).onChange((e) => {
  target.style.fontSize = e + "px";
  canvas.width = target.clientWidth;
  canvas.height = target.clientHeight;
  draw();
});
gui.add(options, "opacity", 0, 100).onChange((e) => {
  canvas.style.opacity = `${e}%`;
  draw();
});
gui.add(options, "scaleWidth").onChange(draw);
gui.add(options, "showOriginal").onChange((e) => {
  target.style.opacity = e ? "100%" : "0%";
});

canvas.width = target.clientWidth;
canvas.height = target.clientHeight;

const textBaseline = "hanging";
function findFontSize(text, ctx = new CanvasRenderingContext2D(), fontName, boxHeight) {
  let size = 1;
  let height = 0;
  let last = 0;
  while (true) {
    const font = `${size++}px ${fontName}`;
    ctx.font = font;
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    ctx.textBaseline = textBaseline;

    const measure = ctx.measureText(text);
    height = measure.actualBoundingBoxDescent;
    // console.log(size - 1, height, boxHeight, font, ctx.measureText(text));

    if (height > boxHeight)
      return {
        fontSize: size - 1,
        measure,
      };

    last = height;

    // if (size > 100) return 10;
  }
}

function draw() {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, options.width, options.height);

  const [size, ...nameSplit] = font.split(" ");
  const name = nameSplit.join(" ");

  const text = target.innerText;

  const bestSize = findFontSize(text, ctx, name, target.clientHeight);

  // console.log(`🚀 ~ file: js.js:69 ~ draw ~ bestSize.measure.:`, bestSize.measure);
  canvas.width = bestSize.measure.actualBoundingBoxRight;

  if (options.scaleWidth) {
    // console.log(`🚀 ~ file: js.js:74 ~ draw ~ options.scaleWidth:`, options.scaleWidth);

    canvas.style.width = `${target.clientWidth}px`;
    canvas.style.height = `${target.clientHeight}px`;
  } else {
    canvas.style.width = "";
    canvas.style.height = "";
  }

  ctx.font = `${bestSize.fontSize}px ${name}`;
  // ctx.font = `${options.size}px ${name}`;
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.textBaseline = textBaseline;
  ctx.fillText(text, options.x, options.y);
}

window.addEventListener("resize", draw);
draw();
