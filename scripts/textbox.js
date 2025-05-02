document.addEventListener("DOMContentLoaded", function () {
  const npcDialogos = [
    "he's exaust of putting his hands in HTML for over a ENTIRE NIGHT",
    "don't interrupt his rest..",
    "PLEASE!"
  ];

  let npcIndex = 0;
  let charIndex = 0;
  let isTyping = false;
  let npcTerminado = false;

  const textElement = document.getElementById("text");
  const npc = document.getElementById("npc");
  const blip = new Audio("audios/blip.wav");
  const sleepy_boy = new Audio("audios/sleepy_boy.wav");
  sleepy_boy.loop = true;

  function escreverTexto(texto, velocidade = 60, callback = null) {
    isTyping = true;
    textElement.innerHTML = "";
    charIndex = 0;

    function escrever() {
      if (charIndex < texto.length) {
        textElement.innerHTML += texto.charAt(charIndex);
        if (texto[charIndex] !== " ") {
          blip.currentTime = 0;
          blip.play().catch(() => {});
        }
        charIndex++;
        setTimeout(escrever, velocidade);
      } else {
        isTyping = false;
        if (callback) callback();
      }
    }

    escrever();
  }

  function mostrarProximaFalaNPC() {
    if (isTyping || npcTerminado) return;

    if (npcIndex < npcDialogos.length) {
      escreverTexto(npcDialogos[npcIndex]);
      npcIndex++;
    } else {
      escreverTexto("Z z Z.", 40, () => {
        setTimeout(() => {
          if (sleepy_boy.paused) {
            sleepy_boy.volume = 0; 
            sleepy_boy.play().then(() => {
              const fadeDuration = 3000;
              const fadeSteps = 30;
              const stepTime = fadeDuration / fadeSteps;
              let currentStep = 0;
          
              const fadeInInterval = setInterval(() => {
                currentStep++;
                sleepy_boy.volume = Math.min(currentStep / fadeSteps, 1);
                if (currentStep >= fadeSteps) {
                  clearInterval(fadeInInterval);
                }
              }, stepTime);
            }).catch(err => {
              console.error("Erro ao tocar áudio:", err);
            });
          }
        }
        )
        setTimeout(() => {
          textElement.innerHTML = "";
          npcTerminado = true; // Impede futuras falas
        }, 3000);
      });
    }
  }

  npc.addEventListener("click", mostrarProximaFalaNPC);
});
