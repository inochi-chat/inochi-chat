// ========================================
// イノチチャット VRM専用モジュール
// 本体のUI・チャット・音声には触らない
// ========================================
console.log("VRM MODULE START");
window.VRMModule = {
  canvas: null,
  renderer: null,
  scene: null,
  camera: null,
  vrm: null,
  // ----------------------------------------
  // 初期化
  // ----------------------------------------
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
      this.canvas =
        document.getElementById("vrmCanvas");
    }
    console.log("VRM: READY");
  },
  // ----------------------------------------
  // ファイル選択欄
  // ----------------------------------------
  showFileSelector: function() {
    console.log("VRM: SHOW FILE SELECTOR");
    if (document.getElementById("vrmFileSelector")) {
      return;
    }
    const panel =
      document.createElement("div");
    panel.id = "vrmFileSelector";
    panel.style.position = "fixed";
    panel.style.left = "50%";
    panel.style.bottom = "75px";
    panel.style.transform = "translateX(-50%)";
    panel.style.zIndex = "100001";
    panel.style.background = "#ffffff";
    panel.style.padding = "16px";
    panel.style.borderRadius = "12px";
    panel.style.boxShadow =
      "0 4px 20px rgba(0,0,0,0.25)";
    panel.style.width = "calc(100% - 32px)";
    panel.style.maxWidth = "420px";
    panel.style.boxSizing = "border-box";
    // ------------------------------------
    // 説明
    // ------------------------------------
    const text =
      document.createElement("div");
    text.textContent =
      "VRMファイルを選択してください";
    text.style.marginBottom = "10px";
    text.style.fontSize = "14px";
    text.style.color = "#333";
    panel.appendChild(text);
    // ------------------------------------
    // 普通のファイル入力
    // ------------------------------------
    const input =
      document.createElement("input");
    input.id = "vrmFileSelectorInput";
    input.type = "file";
    // すべてのファイルを表示
    input.accept = "*/*";
    // 見えない入力欄
    input.style.position = "absolute";
    input.style.opacity = "0";
    input.style.width = "1px";
    input.style.height = "1px";
    panel.appendChild(input);
    // ------------------------------------
    // ファイル選択ボタン
    // ------------------------------------
    const fileButton =
      document.createElement("label");
    fileButton.textContent =
      "📁 ファイルを選択";
    fileButton.setAttribute(
      "for",
      "vrmFileSelectorInput"
    );
    fileButton.style.display = "block";
    fileButton.style.width = "100%";
    fileButton.style.boxSizing = "border-box";
    fileButton.style.padding = "13px";
    fileButton.style.textAlign = "center";
    fileButton.style.background = "#6878ff";
    fileButton.style.color = "#ffffff";
    fileButton.style.borderRadius = "8px";
    fileButton.style.fontSize = "14px";
    fileButton.style.fontWeight = "bold";
    fileButton.style.cursor = "pointer";
    panel.appendChild(fileButton);
    // ------------------------------------
    // 閉じるボタン
    // ------------------------------------
    const closeButton =
      document.createElement("button");
    closeButton.textContent = "閉じる";
    closeButton.style.marginTop = "10px";
    closeButton.style.padding = "8px 12px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "8px";
    closeButton.addEventListener(
      "click",
      function() {
        panel.remove();
      }
    );
    panel.appendChild(closeButton);
    document.body.appendChild(panel);
    // ------------------------------------
    // ファイルが選択されたら読み込む
    // ------------------------------------
    input.addEventListener(
      "change",
      async function() {
        const file =
          input.files && input.files[0];
        if (!file) {
          console.log("VRM: NO FILE");
          return;
        }
        console.log(
          "VRM: FILE =",
          file.name
        );
        // VRM以外を拒否
        if (
          !file.name
            .toLowerCase()
            .endsWith(".vrm")
        ) {
          alert(
            "VRMファイルを選択してください"
          );
          return;
        }
        // 選択欄を閉じる
        panel.remove();
        // VRM読み込み
        await VRMModule.load(file);
      }
    );
    console.log(
      "VRM: FILE SELECTOR SHOWN"
    );
  },
  // ----------------------------------------
  // VRM読み込み
  // ----------------------------------------
  load: async function(file) {
    try {
      console.log("VRM: LOAD START");
      // ------------------------------------
      // Three.js
      // ------------------------------------
      const THREE =
        await import(
          "https://esm.sh/three@0.160.0"
        );
      // ------------------------------------
      // VRM
      // ------------------------------------
      const VRM =
        await import(
          "https://esm.sh/@pixiv/three-vrm@2.1.0?deps=three@0.160.0"
        );
      // ------------------------------------
      // GLTFLoader
      // ------------------------------------
      const GLTFLoaderModule =
        await import(
          "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"
        );
      const GLTFLoader =
        GLTFLoaderModule.GLTFLoader;
      console.log("VRM: THREE OK");
      console.log("VRM: GLTF LOADER OK");
      console.log("VRM: LIBRARY OK");
      // ------------------------------------
      // Scene
      // ------------------------------------
      const scene =
        new THREE.Scene();
      scene.background =
        new THREE.Color(0xeeeeee);
      // ------------------------------------
      // Camera
      // ------------------------------------
      const camera =
        new THREE.PerspectiveCamera(
          30,
          window.innerWidth /
            window.innerHeight,
          0.1,
          100
        );
      camera.position.set(
        0,
        1.3,
        3
      );
      // ------------------------------------
      // Light
      // ------------------------------------
      const light =
        new THREE.DirectionalLight(
          0xffffff,
          2
        );
      light.position.set(
        1,
        2,
        3
      );
      scene.add(light);
      const ambient =
        new THREE.AmbientLight(
          0xffffff,
          1
        );
      scene.add(ambient);
      // ------------------------------------
      // Renderer
      // ------------------------------------
      const renderer =
        new THREE.WebGLRenderer({
          canvas: this.canvas,
          alpha: true,
          antialias: true
        });
      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          2
        )
      );
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
      // ------------------------------------
      // GLTF Loader
      // ------------------------------------
      const loader =
        new GLTFLoader();
      loader.register(
        parser =>
          new VRM.VRMLoaderPlugin(parser)
      );
      // ------------------------------------
      // ファイル読み込み
      // ------------------------------------
      const arrayBuffer =
        await file.arrayBuffer();
      const gltf =
        await new Promise(
          (resolve, reject) => {
            loader.parse(
              arrayBuffer,
              "",
              resolve,
              reject
            );
          }
        );
      const vrm =
        gltf.userData.vrm;
      if (!vrm) {
        throw new Error(
          "VRMデータが見つかりません"
        );
      }
      console.log(
        "VRM: MODEL OK"
      );
      // ------------------------------------
      // 前のVRMを削除
      // ------------------------------------
      if (this.vrm && this.scene) {
        this.scene.remove(
          this.vrm.scene
        );
      }
      this.vrm = vrm;
      scene.add(
        vrm.scene
      );
      // ------------------------------------
      // VRM0向き補正
      // ------------------------------------
      if (
        VRM.VRMUtils &&
        typeof VRM.VRMUtils.rotateVRM0 ===
          "function"
      ) {
        VRM.VRMUtils.rotateVRM0(
          vrm
        );
      }
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
      // ------------------------------------
      // VRM表示
      // ------------------------------------
      this.canvas.style.display =
        "block";
      // ------------------------------------
      // アニメーション
      // ------------------------------------
      const clock =
        new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(
          animate
        );
        const delta =
          clock.getDelta();
        if (this.vrm) {
          this.vrm.update(
            delta
          );
        }
        renderer.render(
          scene,
          camera
        );
      };
      animate();
      console.log(
        "VRM: DISPLAY OK"
      );
    } catch (error) {
      console.error(
        "VRM LOAD ERROR:",
        error
      );
      alert(
        "VRMの読み込みに失敗しました。\n\n" +
        error.message
      );
    }
  }
};
// ========================================
// 設定画面の既存VRMボタンにつなぐ
// ========================================
window.addEventListener("load", function() {
  VRMModule.init();
  const existingVRMButton =
    document.getElementById("vrmLoadButton");
  if (existingVRMButton) {
    existingVRMButton.addEventListener("click", function() {
      alert("VRMボタンは反応しています");
      VRMModule.showFileSelector();
    });
  }
});
console.log("VRM MODULE READY");
