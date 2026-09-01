import createInochi2DController from "./inochi_bridge_new.js";
window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("app");
  if (!canvas) {
    console.error("Canvas #app が見つかりません");
    return;
  }
  let controller = null;
  /*
   * =====================================================
   * Inochi2D Bridge
   * =====================================================
   */
  try {
    console.log("BRIDGE INITIALIZING...");
    controller = await createInochi2DController({
      wasmUrl: "/inochi2d-test/inochi2d_bg.wasm",
      debug: true,
    });
    console.log("BRIDGE OK");
  } catch (error) {
    console.error("BRIDGE ERROR", error);
    return;
  }
  /*
   * =====================================================
   * Canvas mount
   * =====================================================
   */
  try {
    controller.mount(canvas);
    console.log("CANVAS MOUNTED");
  } catch (error) {
    console.error("MOUNT ERROR", error);
    return;
  }
  /*
   * =====================================================
   * Model
   * =====================================================
   */
  try {
    console.log("MODEL LOADING...");
    const result = await controller.loadModel(
      "/inochi2d-test/model.inp"
    );
    console.log("[CHARACTER] MODEL RESULT", result);
    console.log(
      "[CHARACTER] DEBUG",
      controller.getDebugState()
    );
    console.log("MODEL LOADED");
    console.log(
      "PARAMETERS:",
      result.parameters?.length ?? 0
    );
    console.log(
      "MOUTH:",
      result.mouthFound ? "FOUND" : "NOT FOUND"
    );
  } catch (error) {
    console.error("MODEL ERROR", error);
    return;
  }
  /*
   * =====================================================
   * Resize
   * =====================================================
   */
  function resizeCanvas() {
    if (!controller) return;
    const rect = canvas.getBoundingClientRect();
    controller.resize(
      rect.width || window.innerWidth,
      rect.height || window.innerHeight,
      window.devicePixelRatio || 1
    );
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  console.log("CHARACTER READY");
});
