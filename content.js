chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendNextMessage') {
    chrome.storage.local.get(['phoneNumbers', 'message', 'currentIndex'], async (data) => {
      if (data.currentIndex < data.phoneNumbers.length) {
        // Search and click on search bar
        const searchBar = document.querySelector('div[contenteditable="true"][data-tab="3"]');
        if (searchBar) {
          searchBar.focus();
          searchBar.innerHTML = data.phoneNumbers[data.currentIndex];

          // Trigger input event to activate search
          const event = new Event('input', { bubbles: true });
          searchBar.dispatchEvent(event);

          // Wait for contact to load
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Click on first contact
          const firstContact = document.querySelector('div[role="button"]');
          if (firstContact) {
            firstContact.click();

            // Wait for chat to open
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Find message input and send message
            const messageInput = document.querySelector('div[contenteditable="true"][data-tab="1"]');
            if (messageInput) {
              messageInput.focus();
              messageInput.innerHTML = data.message;

              // Trigger input event
              const inputEvent = new Event('input', { bubbles: true });
              messageInput.dispatchEvent(inputEvent);

              // Find and click send button
              const sendButton = document.querySelector('button[data-tab="11"]');
              if (sendButton) {
                sendButton.click();

                // Update current index
                chrome.storage.local.set({
                  currentIndex: data.currentIndex + 1
                }, () => {
                  // Schedule next message
                  chrome.runtime.sendMessage({
                    action: 'scheduleNextMessage',
                    delay: 120000 // 2 minutes
                  });
                });
              }
            }
          }
        }
      } else {
        // All messages sent
        chrome.runtime.sendMessage({ action: 'allMessagesSent' });
      }
    });
  }
});