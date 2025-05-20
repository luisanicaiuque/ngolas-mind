const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeJ-GXVrVEiCCD4tdNToWrIkco7r31x855u2nuqyAyQMJ0rHQ/formResponse';
const entryIDs = {
  name: 'entry.917707433',
  mood: 'entry.2047156573',
  sleep: 'entry.619034236',
  anxiety: 'entry.1435255577',
  contact: 'entry.1556694830'
};

const questions = [
  { text: "Como você está se sentindo hoje?", entry: entryIDs.mood, options: ["Muito bem", "Bem", "Neutro", "Triste", "Muito triste"] },
  { text: "Você tem dormido bem?", entry: entryIDs.sleep, options: ["Sim", "Não"] },
  { text: "Tem se sentido ansioso(a)?", entry: entryIDs.anxiety, options: ["Sim", "Não"] },
  { text: "Gostaria que um voluntário entre em contato com você?", entry: entryIDs.contact, options: ["Sim", "Não"] },
  { text: "Informe seu nome ou email (opcional):", entry: entryIDs.name, options: null }
];

let current = 0;
let responses = {};

const modal = document.getElementById("chat-modal");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");

document.getElementById("chatbot-button").onclick = () => {
  modal.style.display = "flex";
  current = 0;
  responses = {};
  showQuestion();
};

function showQuestion() {
  const q = questions[current];
  questionText.innerText = q.text;
  answerButtons.innerHTML = "";

  if (q.options) {
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.style.margin = "5px";
      btn.style.padding = "8px 12px";
      btn.style.border = "1px solid #ccc";
      btn.style.background = "#f0f0f0";
      btn.style.borderRadius = "5px";
      btn.style.cursor = "pointer";
      btn.onclick = () => {
        responses[q.entry] = opt;
        current++;
        current < questions.length ? showQuestion() : submitResponses();
      };
      answerButtons.appendChild(btn);
    });
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Seu nome ou email";
    input.style.width = "100%";
    input.style.padding = "8px";
    input.style.marginBottom = "10px";

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Enviar";
    submitBtn.style.padding = "8px 12px";
    submitBtn.style.background = "#eaec43";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "5px";
    submitBtn.style.cursor = "pointer";

    submitBtn.onclick = () => {
      responses[q.entry] = input.value;
      submitResponses();
    };

    answerButtons.appendChild(input);
    answerButtons.appendChild(submitBtn);
  }
}

function submitResponses() {
  const formData = new FormData();
  for (const entry in responses) {
    formData.append(entry, responses[entry]);
  }

  fetch(formURL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  }).then(() => {
    questionText.innerText = "Obrigado por compartilhar! 💙";
    answerButtons.innerHTML = "";
    const close = document.createElement("button");
    close.innerText = "Fechar";
    close.style.marginTop = "10px";
    close.style.padding = "6px 10px";
    close.style.background = "#ccc";
    close.onclick = () => {
      modal.style.display = "none";
    };
    answerButtons.appendChild(close);
  });
}
