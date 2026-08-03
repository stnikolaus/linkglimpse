let activeUrl;

function reportUrl(pageUrl) {
  const url = new URL('https://www.linkglimpse.com/report');
  url.searchParams.set('url', pageUrl);
  url.searchParams.set('utm_source', navigator.userAgent.includes('Firefox') ? 'firefox_extension' : 'chrome_extension');
  url.searchParams.set('utm_medium', 'browser_extension');
  url.searchParams.set('utm_campaign', 'open_source_distribution');
  return url.toString();
}

const inspectButton = document.querySelector('#inspect');
const pageUrl = document.querySelector('#page-url');
const error = document.querySelector('#error');

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  activeUrl = tabs[0]?.url;
  if (!activeUrl || !/^https?:\/\//i.test(activeUrl)) {
    pageUrl.textContent = 'This browser page cannot be inspected.';
    error.textContent = 'Open a public HTTP or HTTPS page and try again.';
    error.hidden = false;
    return;
  }

  pageUrl.textContent = activeUrl;
  pageUrl.title = activeUrl;
  inspectButton.disabled = false;
});

inspectButton.addEventListener('click', () => {
  if (!activeUrl) return;
  chrome.tabs.create({ url: reportUrl(activeUrl) });
  window.close();
});
