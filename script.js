let chatHistory = [];
let config;
fetch('config.json')
        .then(response => response.json())
        .then(data => config = data)

function sendMessage() {
    console.log(config)
    

    let messageInput = document.getElementById('messageInput');
    let message = messageInput.value;

     //add user message to screen
    let chatbox = document.getElementById("chatbox");
    let userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<p>${message}</p><span>${new Date()}</span><img class="avatar" src="https://avatars.githubusercontent.com/u/20050327?v=4"></img>`
    chatbox.appendChild(userMessage)

    chatbox.scrollTop = chatbox.scrollHeight;
   
    //Starting loading 
    document
    .getElementById('loading')
    .classList
    .add('indeterminate');

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
        document
        .getElementById('loading')
        .className="";
        
        let gptResponse = data.choices[0].message.content.trim();
        let botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `<img class="avatar" src="assets/bot.png"></img><p>${gptResponse}</p><span>${new Date()}</span>`
        chatbox.appendChild(botMessage)

        chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(error => {
        console.error(error);
        let errorMessage = document.createElement('div');
        errorMessage.className = 'message error-message';
        errorMessage.innerHTML = `<img class="avatar" src="assets/bot.png"></img><p>Erro ao acessar o ChatGPT</p><span>${new Date()}</span>`
        chatbox.appendChild(errorMessage)

        chatbox.scrollTop = chatbox.scrollHeight;
    })
    //alert(JSON.stringify(messageInput.value, null,2))
}