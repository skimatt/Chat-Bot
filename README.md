🌐 OpenAI Proxy via Cloudflare Workers
Proyek ini adalah proxy sederhana menggunakan Cloudflare Workers untuk menghubungkan chatbot ke OpenAI API. Proxy ini berguna untuk menghindari batasan CORS dan menyembunyikan API Key di frontend.

📌 Fitur
✅ Proxy API ke OpenAI (GPT-3.5/4)
✅ Mengamankan API Key dengan Cloudflare Workers
✅ Menghindari masalah CORS di frontend
✅ Gratis tanpa perlu server tambahan

🚀 1️⃣ Cara Deploy di Cloudflare Workers
1. Buat Cloudflare Workers
Masuk ke Cloudflare Dashboard
Buka menu "Workers & Pages" → "Create a Service"
Pilih "HTTP Handler" sebagai template
Klik "Quick Edit" lalu ganti kode dengan berikut:
📝 Kode Cloudflare Workers
javascript
Salin
Edit
export default {
  async fetch(request) {
    const url = "https://api.openai.com/v1/chat/completions"; // API OpenAI

    const headers = {
      "Authorization": "Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // GANTI dengan API Key OpenAI
      "Content-Type": "application/json"
    };

    try {
      const body = await request.json(); // Ambil data dari request frontend
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy Error" }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  }
};
📌 Ganti sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX dengan API Key OpenAI Anda!

2. Simpan dan Deploy
Klik "Save and Deploy"
Tunggu hingga Cloudflare Workers aktif
Salin URL Workers yang sudah dibuat, misalnya:
arduino
Salin
Edit
https://b89b49ab-deepseek-proxy.rahmatyoung10.workers.dev/
💡 2️⃣ Menghubungkan ke Chatbot Frontend
Di frontend chatbot (HTML + JavaScript), update kode API di script.js:

javascript
Salin
Edit
let apiUrl = "https://b89b49ab-deepseek-proxy.rahmatyoung10.workers.dev/";

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
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

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        let result = await response.json();
        let botReply = result.choices[0].message.content || "Maaf, ada kesalahan.";

        // Tampilkan pesan bot
        chatBox.innerHTML += `<div class="bot-message"><b>Bot:</b> ${botReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message"><b>Bot:</b> Maaf, server tidak merespons.</div>`;
    }
}
🛠 3️⃣ Cara Testing API Proxy
1. Uji API di Terminal (cURL)
sh
Salin
Edit
curl -X POST "https://b89b49ab-deepseek-proxy.rahmatyoung10.workers.dev/" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Halo, siapa kamu?"}]
  }'
Jika berhasil, akan mendapatkan respons JSON dari OpenAI.

2. Gunakan Postman
Buka Postman
Set method ke POST
URL:
arduino
Salin
Edit
https://b89b49ab-deepseek-proxy.rahmatyoung10.workers.dev/
Headers:
json
Salin
Edit
{ "Content-Type": "application/json" }
Body (JSON):
json
Salin
Edit
{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Halo, siapa kamu?"}]
}
Klik "Send", pastikan mendapat respons JSON dari OpenAI.
