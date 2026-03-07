import axios from "axios";

export async function runAgent(prompt) {
  try {
    // Use the proxied URL instead of direct localhost:18789
    const response = await axios.post("/openclaw-api/v1/chat/completions", {
      messages: [{ role: "user", content: prompt }],
      model: "openclaw-agent"
    }, {
      headers: {
        "Authorization": "Bearer e8f6e029e87f1af09ebda2441955bcf9e7f71bad24190652",
        "Content-Type": "application/json"
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenClaw API error:", error.response?.data || error.message);
    throw error;
  }
}
