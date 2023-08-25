
// background.js
console.log("background.js loaded");
const urlMappings = {
  "youtube.com/watch":"youtubeAbRepeat.js"
  // 他のURLとスクリプトのマッピングを追加...
};

let isEnabled = true; // デフォルトは有効

chrome.action.onClicked.addListener((tab) => {
  isEnabled = !isEnabled; // 有効／無効を切り替え

  if (isEnabled) {
    chrome.action.setIcon({ path: 'icons/enabledIcon.png' });
    chrome.storage.sync.set({ isEnabled: true });
  } else {
    chrome.action.setIcon({ path: 'icons/disabledIcon.png' });
    chrome.storage.sync.set({ isEnabled: false });
  }
});

// Webページに対するスクリプトの注入をチェックするロジック
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {//タブの更新で発火
  console.log("chrome.tabs.onUpdated");
  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      console.log(JSON.stringify(tab));
      if (tab.url && !tab.url.startsWith('chrome://')) {
        console.log("check passed");
        chrome.storage.sync.get('isEnabled', (data) => {//chromeのストレージをチェック
          if (data.isEnabled) {
            console.log("switch is Enabled");
            // 有効の場合、urlMappingに沿ってスクリプトを注入する
            for (let [urlPart, scriptFile] of Object.entries(urlMappings)) {
              console.log(tab.url, urlPart, scriptFile)
              if (tab.url.includes(urlPart)) {
                console.log("matched");
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: [scriptFile]
                });
                console.log("injected");
                chrome.action.setIcon({ path: 'icons/injectedIcon.png' });

                break;  // URLにマッチした場合はループを抜ける
              }
            }
          }
        });
      }
    });
  }
});

// 拡張機能起動時に前回の状態を取得
chrome.runtime.onStartup.addListener(() => {
  console.log("on Startup")
  chrome.storage.sync.get('isEnabled', (data) => {
    isEnabled = data.isEnabled;
  });
  if (data.isEnabled) {
    chrome.action.setIcon({ path: 'icons/enabledIcon.png' });
  } else {
    chrome.action.setIcon({ path: 'icons/disabledIcon.png' });
  }

});

