document.addEventListener("DOMContentLoaded", function () {
  const npcDialogos = [
    "hello you... INPATIENT THING!",  // Primeiro diálogo
    "i haven't finished my place yet you rabel",  // Segundo diálogo
  ];

  const npcImagensDialogos = [
    "images/stone_variations1.png", // Imagem para o primeiro diálogo
    "images/stone_variations2.png", // Imagem para o segundo diálogo
  ];

  let npcIndex = 0;
  let charIndex = 0;
  let isTyping = false;
  let npcTerminado = false;
  let textoAtual = "";
  let callbackFinal = null;

  const textElement = document.getElementById("text");
  const npc = document.getElementById("npc");
  const blip = new Audio("audios/blip.wav");

  function escreverTexto(texto, velocidade = 60, callback = null) {
    isTyping = true;
    textoAtual = texto;
    callbackFinal = callback;
    textElement.textContent = "";
    charIndex = 0;

    npc.style.pointerEvents = "none";  // Desabilita cliques enquanto digita

    function escrever() {
      if (charIndex < texto.length) {
        textElement.textContent += texto.charAt(charIndex);
        if (texto[charIndex] !== " ") {
          blip.currentTime = 0;
          blip.play().catch(() => {});
        }
        charIndex++;
        setTimeout(escrever, velocidade);
      } else {
        isTyping = false;
        if (!npcTerminado) {
          npc.style.pointerEvents = "auto";  // Habilita cliques após a digitação
        }
        if (callback) callback();
      }
    }

    escrever();
  }

  function voltarParaIdle() {
    npc.src = "images/stone_idle.gif";  // Imagem padrão (idle)
  }

  function mostrarPerguntas() {
    npc.src = "images/stone_variations1.png";  // Defina a imagem para quando mostrar as perguntas
    escreverTexto("So... Have anything in mind?", 60, () => {
      // Espera a transição do texto antes de mostrar as perguntas
      setTimeout(() => {
        textElement.innerHTML = `
          <button id="pergunta1" class="botao-dialogo">What's up with the boombox?</button><br>
          <button id="pergunta2" class="botao-dialogo">When will the store be ready?</button>
        `;

        const pergunta1 = document.getElementById("pergunta1");
        const pergunta2 = document.getElementById("pergunta2");

        // Torna as perguntas clicáveis apenas após o texto e a pausa
        pergunta1.disabled = false;
        pergunta2.disabled = false;

        pergunta1.addEventListener("click", responderSobreCaixaDeSom);
        pergunta2.addEventListener("click", responderSobreLoja);

        npcTerminado = true;  // Permite que o NPC termine a interação
      }, 3000); // Espera 3 segundos antes de mostrar as opções
    });
  }

  function responderSobreCaixaDeSom() {
    npc.src = "images/stone_variations3.png";  // Muda para imagem específica da resposta
    escreverTexto("Ah, the boombox? i don't have any CDs... Sadly", 60, () => {
      setTimeout(finalizarDialogo, 3000);
    });
  }

  function responderSobreLoja() {
    npc.src = "images/stone_variations4.png";  // Muda para imagem específica da resposta
    escreverTexto("The place? It's under construction. No opening date yet...", 60, () => {
      setTimeout(finalizarDialogo, 3000);
    });
  }

  function finalizarDialogo() {
    escreverTexto("That's all i have to say, GO AWAY!!", 60, () => {
      setTimeout(() => {
        textElement.textContent = "";
        voltarParaIdle();
      }, 3000);
    });
  }

  function mostrarProximaFalaNPC() {
    if (isTyping || npcTerminado) return;  // Impede novo clique durante digitação ou após terminar o diálogo

    trocarImagemNPC();

    if (npcIndex < npcDialogos.length) {
      escreverTexto(npcDialogos[npcIndex]);
      npcIndex++;
    } else {
      mostrarPerguntas();  // Passa para as opções automaticamente
    }
  }

  function trocarImagemNPC() {
    if (npcIndex < npcImagensDialogos.length) {
      npc.src = npcImagensDialogos[npcIndex];  // Troca a imagem do NPC conforme o diálogo
    }
  }

  npc.addEventListener("click", mostrarProximaFalaNPC);

  // Garante que o NPC comece com o sprite idle
  voltarParaIdle();
});
