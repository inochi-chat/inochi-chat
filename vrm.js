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
    // VRM用キャンバスを作成
    if (!document.getElementById("vrmCanvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "vrmCanvas";
      canvas.style.position = "fixed";
      canvas.style.left = "0";
      canvas.style.top = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      // 既存UIより下
      canvas.style.zIndex = "1";
      // UI操作を絶対に邪魔しない
      canvas.style.pointerEvents = "none";
      canvas.style.display = "none";
      document.body.appendChild(canvas);
      this.canvas = canvas;
    } else {
      this.canvas = document.getElementById("vrmCanvas");
    }
    // VRM読み込みボタン
    this.createButton();
    console.log("VRM: READY");
  },
  // ----------------------------------------
  // VRMボタンを作成
  // ----------------------------------------
  createButton: function() {
    if (document.getElementById("vrmLoadButtonSafe")) {
      return;
    }
    const button = document.createElement("button");
    button.id = "vrmLoadButtonSafe";
    button.textContent = "🎭 VRMを読み込む";
    button.style.position = "fixed";
    button.style.right = "16px";
    button.style.bottom = "16px";
    button.style.zIndex = "100000";
    button.style.padding = "10px 14px";
    button.style.borderRadius = "10px";
    button.style.border = "none";
    button.style.background = "#333";
    button.style.color = "#fff";
    button.style.fontSize = "14px";
    button.style.pointerEvents = "auto";
    button.addEventListener("click", function() {
      VRMModule.openFile();
    });
    document.body.appendChild(button);
    console.log("VRM: BUTTON CREATED");
  },
  // ----------------------------------------
  // ファイル選択
  // ----------------------------------------
  openFile: function() {
    console.log("VRM: FILE SELECT");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.addEventListener("change", async function() {
      const file = input.files && input.files[0];
      if (!file) {
        console.log("VRM: NO FILE");
        return;
      }
      console.log("VRM: FILE =", file.name);
      if (!file.name.toLowerCase().endsWith(".vrm")) {
        alert("VRMファイルを選択してください");
        return;
      }
      await VRMModule.load(file);
    });
    input.click();
  },
  // ----------------------------------------
  // VRM読み込み
  // ----------------------------------------
  load: async function(file) {
    try {
      console.log("VRM: LOAD START");
      // ライブラリ読み込み
      const THREE =
        await import(
          "https://esm.sh/three@0.160.0"
        );
      const VRM =
        await import(
          "https://esm.sh/@pixiv/three-vrm@2.1.0?deps=three@0.160.0"
        );
      console.log("VRM: THREE OK");
      console.log("VRM: LIBRARY OK");
      // ------------------------------------
      // Scene
      // ------------------------------------
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeeeeee);
      // ------------------------------------
      // Camera
      // ------------------------------------
      const camera =
        new THREE.PerspectiveCamera(
          30,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        );
      camera.position.set(0, 1.3, 3);
      // ------------------------------------
      // Light
      // ------------------------------------
      const light =
        new THREE.DirectionalLight(
          0xffffff,
          2
        );
      light.position.set(1, 2, 3);
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
        Math.min(window.devicePixelRatio, 2)
      );
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
      // ------------------------------------
      // VRM読み込み
      // ------------------------------------
      const loader =
        new THREE.GLTFLoader();
      loader.register(
        parser =>
          new VRM.VRMLoaderPlugin(parser)
      );
      const arrayBuffer =
        await file.arrayBuffer();
      const gltf =
        await new Promise((resolve, reject) => {
          loader.parse(
            arrayBuffer,
            "",
            resolve,
            reject
          );
        });
      const vrm =
        gltf.userData.vrm;
      if (!vrm) {
        throw new Error("VRMデータが見つかりません");
      }
      console.log("VRM: MODEL OK");
      // ------------------------------------
      // 前のVRMを削除
      // ------------------------------------
      if (this.vrm) {
        scene.remove(
          this.vrm.scene
        );
      }
      this.vrm = vrm;
      scene.add(vrm.scene);
      // VRM0の場合の向き補正
      if (VRM.VRMUtils) {
        if (
          typeof VRM.VRMUtils.rotateVRM0 ===
          "function"
        ) {
          VRM.VRMUtils.rotateVRM0(vrm);
        }
      }
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
      // VRM表示
      this.canvas.style.display = "block";
      // ------------------------------------
      // アニメーション
      // ------------------------------------
      const clock =
        new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(animate);
        const delta =
          clock.getDelta();
        if (this.vrm) {
          this.vrm.update(delta);
        }
        renderer.render(
          scene,
          camera
        );
      };
      animate();
      console.log("VRM: DISPLAY OK");
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
// ページ読み込み後に初期化
// ========================================
window.addEventListener(
  "load",
  function() {
    VRMModule.init();
  }
);
console.log("VRM MODULE READY");
