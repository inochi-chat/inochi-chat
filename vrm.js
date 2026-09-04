// ========================================
// VRM専用ファイル
// イノチチャット本体には直接触らない
// ========================================
console.log("VRM MODULE LOADED");
// VRM機能をあとからここに追加していく
window.VRMModule = {
  // VRM読み込み
  load: async function(file) {
    console.log("VRM LOAD:", file.name);
    // 今は読み込み確認だけ
    if (!file.name.toLowerCase().endsWith(".vrm")) {
      console.warn("VRMファイルではありません");
      return false;
    }
    console.log("VRM FILE OK");
    return true;
  }
};
