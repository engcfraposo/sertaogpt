let chatHistory = [];
let config;
fetch('config.json')
        .then(response => response.json())
        .then(data => config = data)
        .catch(error => console.error("error to get config envs", error))

function sendMessage() {
    let messageInput = document.getElementById('messageInput');
    let message = messageInput.value;

     //add user message to screen
    let chatbox = document.getElementById("chatbox");
    sendUserMessage(message, chatbox);
    //Starting loading 
    document
    .getElementById('loading')
    .classList
    .add('indeterminate');
    if(message.toLowerCase().includes("gerar imagem")){
        callToDALLE(config, message, chatbox)
        return
    }
    callToGPT(config, message, chatbox)
}

function callToGPT(config, message, chatbox){
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${config["OPENAI_API_KEY"]}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": message}]
        })
    })
    .then(response => response.json())
    .then(data => {
        //Finish loading
        document.getElementById('loading').className="";
        let gptResponse = data.choices[0].message.content.trim();
        let innerHTML = `<img class="avatar" src="assets/bot.png"></img><p>${gptResponse}</p><span>${new Date()}</span>`
        sendBotMessage(innerHTML, chatbox);
    })
    .catch(error => {
        sendErrorMessage(error, chatbox)
    })
}

function callToDALLE(config, message, chatbox){
    fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${config["OPENAI_API_KEY"]}`
        },
        body: JSON.stringify({
            "prompt": message,
            "n": 1,
            "size": "256x256"
        })
    })
    .then(response => response.json())
    .then(data => {
        //Finish loading
        document.getElementById('loading').className="";
        let dalleResponse = data.data[0].url;
        let innerHTML = `<img class="avatar" src="assets/bot.png"></img><img class="dalle" src="${dalleResponse}"></img><span>${new Date()}</span>`
        sendBotMessage(innerHTML, chatbox);
    })
    .catch(error => {
        sendErrorMessage(error, chatbox)
    })
}

function sendErrorMessage(error, chatbox){
    console.error(error);
    let errorMessage = document.createElement('div');
    errorMessage.className = 'message error-message';
    errorMessage.innerHTML = `<img class="avatar" src="assets/bot.png"></img><p>Erro ao acessar o ChatGPT</p><span>${new Date()}</span>`
    chatbox.appendChild(errorMessage)
    chatbox.scrollTop = chatbox.scrollHeight;
}

function sendBotMessage(innerHTML, chatbox){
    let botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.innerHTML = innerHTML
    chatbox.appendChild(botMessage)
    chatbox.scrollTop = chatbox.scrollHeight;
}

function sendUserMessage(message, chatbox){
    let userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<p>${message}</p><span>${new Date()}</span><img class="avatar" src="https://avatars.githubusercontent.com/u/20050327?v=4"></img>`
    chatbox.appendChild(userMessage)
    chatbox.scrollTop = chatbox.scrollHeight;
}