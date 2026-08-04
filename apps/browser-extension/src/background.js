const REPORT_BASE = 'https://www.linkglimpse.com/report';
const MENU_ID = 'linkglimpse-inspect-page';

function reportUrl(pageUrl) {
  const url = new URL(REPORT_BASE);
  url.searchParams.set('url', pageUrl);
  url.searchParams.set('utm_source', navigator.userAgent.includes('Firefox') ? 'firefox_extension' : 'chrome_extension');
  url.searchParams.set('utm_medium', 'browser_extension');
  url.searchParams.set('utm_campaign', 'open_source_distribution');
  return url.toString();
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Inspect this page with LinkGlimpse',
      contexts: ['page', 'link'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const target = info.linkUrl || info.pageUrl || tab?.url;
  if (!target || !/^https?:\/\//i.test(target)) return;
  chrome.tabs.create({ url: reportUrl(target) });
});
