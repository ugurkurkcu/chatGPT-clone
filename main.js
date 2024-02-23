const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const API_key = "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";
const themeButton = document.getElementById("theme-btn");
const deleteButton = document.getElementById("delete-btn");

let userText = null;

//
// fonctions
//
const dataLoadFromLocalStorage = () => {
  const defaultText = `
    <div class="default-text">
        <h1>ChatGPT Clone</h1>
        <p></p>
    </div>
    `;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
};
dataLoadFromLocalStorage();
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incommingChatDiv) => {
  const API_url = "https://api.openai.com/v1/chat/completions";
  const pElement = document.createElement("p");

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `${userText}`,
      },
    ],
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_key}`,
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await (await fetch(API_url, requestOptions)).json();

    // const data = await response.json();

    pElement.textContent = response.choices[0].message.content;

    // console.log(pElement);
  } catch (error) {
    // console.log(error);
    pElement.classList.add("error");
    pElement.textContent = "OOPS !!!";
  }
  incommingChatDiv.querySelector(".typing-animation").remove();
  incommingChatDiv.querySelector(".chat-details").appendChild(pElement);

  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="./images/chatbot.jpg" alt="" />
            <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
        </div>
    </div>
    `;

  const incommingChatDiv = createElement(html, "incomming");
  chatContainer.appendChild(incommingChatDiv);
  getChatResponse(incommingChatDiv);
};

const handleOutGoingChat = () => {
  userText = chatInput.value.trim();

  if (!userText) return;

  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="./images/profile-pic.png" alt="" />
            <p>${userText}</p>
        </div>
    </div>
`;
  const outgoingChatDiv = createElement(html, "outgoing");
  document.querySelector(".default-text").remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = "";
  setTimeout(() => {
    showTypingAnimation();
  }, 500);
};
//
// listeners
//

sendButton.addEventListener("click", handleOutGoingChat);

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Tum sohbeti silmek istediginize emin misiniz?")) {
    localStorage.removeItem("all-chats");
    dataLoadFromLocalStorage();
  }
});

// document.addEventListener("DOMContentLoaded", dataLoadFromLocalStorage);
