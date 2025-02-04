document.getElementById("send-btn").addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

async function sendMessage() {
  let inputField = document.getElementById("user-input");
  let chatBox = document.getElementById("chat-box");
  let userMessage = inputField.value.trim();

  if (!userMessage) return;

  // Tampilkan pesan user
  chatBox.innerHTML += `<div class="user-message"><b>Kamu:</b> ${userMessage}</div>`;
  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Ganti dengan URL baru dari Cloudflare Proxy
  let apiUrl = "https://b89b49ab-deepseek-proxy.rahmatyoung10.workers.dev/";

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error("Server Error");
    }

    let result = await response.json();
    let botReply = result.choices[0].message.content || "Maaf, ada kesalahan.";

    // Tampilkan pesan bot
    chatBox.innerHTML += `<div class="bot-message"><b>ski:</b> ${botReply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    chatBox.innerHTML += `<div class="bot-message"><b>ski:</b> Maaf, server tidak merespons.</div>`;
  }
}
