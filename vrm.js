// ========================================
// イノチチャット VRM専用モジュール
// ========================================
console.log("VRM MODULE START");
window.VRMModule = {
  viewer: null,
  vrm: null,
  canvas: null,
  init: async function() {
    console.log("VRM: INIT");
    // VRM用キャンバス
    if (!document.getElementById("vrmCanvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "vrmCanvas";
      canvas.style.position = "fixed";
      canvas.style.left = "0";
      canvas.style.top = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "1";
      canvas.style.pointerEvents = "none";
      canvas.style.display = "none";
      document.body.appendChild(canvas);
      this.canvas = canvas;
    } else {
      this.canvas = document.getElementById("vrmCanvas");
    }
    // Three.jsを読み込む
    if (!window.THREE) {
      console.log("VRM: THREE.jsを読み込みます");
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
      script.onload = function() {
        console.log("VRM: THREE.js OK");
      };
      script.onerror = function() {
        console.error("VRM: THREE.js LOAD ERROR");
      };
      document.head.appendChild(script);
    } else {
      console.log("VRM: THREE.js ALREADY OK");
    }
  },
  show: function() {
    if (!this.canvas) {
      console.warn("VRM: canvasがありません");
      return;
    }
    this.canvas.style.display = "block";
    console.log("VRM: SHOW");
  },
  hide: function() {
    if (!this.canvas) return;
    this.canvas.style.display = "none";
    console.log("VRM: HIDE");
  }
};
window.addEventListener("load", function() {
  VRMModule.init();
});
console.log("VRM MODULE READY");
