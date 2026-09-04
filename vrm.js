// ========================================
// イノチチャット VRM専用モジュール
// ========================================
console.log("VRM MODULE START");
window.VRMModule = {
  viewer: null,
  vrm: null,
  canvas: null,
  init: function() {
    console.log("VRM: 表示領域を作成");
    // すでに作られていたら何もしない
    if (document.getElementById("vrmCanvas")) {
      console.log("VRM: canvas already exists");
      return;
    }
    // VRM専用キャンバス
    const canvas = document.createElement("canvas");
    canvas.id = "vrmCanvas";
    // 画面いっぱいに重ねる
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    // 既存の画面より下
    canvas.style.zIndex = "1";
    // VRMキャンバスが操作を邪魔しないようにする
    canvas.style.pointerEvents = "none";
    // 最初は非表示
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    console.log("VRM: canvas OK");
  },
  show: function() {
    if (!this.canvas) {
      this.init();
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
// ページ読み込み後にVRMの場所だけ作る
window.addEventListener("load", function() {
  VRMModule.init();
});
console.log("VRM MODULE READY");
