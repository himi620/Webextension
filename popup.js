document.addEventListener('DOMContentLoaded', function () {
  const phoneNumbersInput = document.getElementById('phoneNumbers');
  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('sendButton');
  const statusDiv = document.getElementById('status');

  sendButton.addEventListener('click', function () {
    const phoneNumbers = phoneNumbersInput.value.split(',').map(num => num.trim());
    const message = messageInput.value;

    if (phoneNumbers.length === 0 || !message) {
      statusDiv.textContent = 'Please enter phone numbers and a message';
      return;
    }

    // Send message to background script to start processing
    chrome.runtime.sendMessage({
      action: 'startBulkSend',
      phoneNumbers: phoneNumbers,
      message: message
    }, function (response) {
      statusDiv.textContent = response.status;
    });
  });
});