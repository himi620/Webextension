chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startBulkSend') {
    // Store the sending parameters
    chrome.storage.local.set({
      phoneNumbers: request.phoneNumbers,
      message: request.message,
      currentIndex: 0
    }, () => {
      // Open WhatsApp Web
      chrome.tabs.create({ url: 'https://web.whatsapp.com' }, (tab) => {
        // Wait for the tab to load before sending messages
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            sendResponse({ status: 'Started sending messages' });
          }
        });
      });
    });
    return true; // Indicates we wish to send a response asynchronously
  }

  // Handle scheduling next message
  if (request.action === 'scheduleNextMessage') {
    setTimeout(() => {
      chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'sendNextMessage' });
        }
      });
    }, request.delay);
  }
});