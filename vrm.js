// ========================================
// イノチチャット VRM専用モジュール
// 本体のチャット・設定・音声には触れない
// ========================================
console.log("VRM MODULE START");
window.VRMModule = {
  viewer: null,
  vrm: null,
  async init(container) {
    if (!container) {
      console.warn("VRM: 表示場所がありません");
      return false;
    }
    console.log("VRM: 初期化開始");
    // Three.js がまだ読み込まれていない場合
    if (!window.THREE) {
      console.warn("VRM: THREE.js がありません");
      return false;
    }
    console.log("VRM: THREE.js OK");
    // VRMライブラリ確認
    if (!window.VRM) {
      console.warn("VRM: VRMライブラリがありません");
      return false;
    }
    console.log("VRM: VRMライブラリ OK");
    return true;
  },
  async load(file) {
    if (!file) {
      console.warn("VRM: ファイルがありません");
      return false;
    }
    if (!file.name.toLowerCase().endsWith(".vrm")) {
      console.warn("VRM: .vrm ファイルを選択してください");
      return false;
    }
    console.log("VRM FILE OK:", file.name);
    // この段階ではファイル確認まで
    // 実際の3D表示処理は次の段階で追加する
    return true;
  }
};
console.log("VRM MODULE READY");
