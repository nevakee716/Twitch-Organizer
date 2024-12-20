import browser from "webextension-polyfill";

export function sendMessage(request: any) {
  return browser.tabs.sendMessage(0, request, undefined);
}

let queryInfo: browser.Tabs.QueryQueryInfoType = {
  active: true,
  currentWindow: true,
};

export function sendMessageToContentScript(message: string): void {
  browser.tabs.query(queryInfo).then((tabs: browser.Tabs.Tab[]) => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id as any, { text: message });
    }
  });
}
