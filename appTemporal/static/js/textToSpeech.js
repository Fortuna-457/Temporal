

window.onload = function() {
    let selectedVolume = 1; // Default volume
    let synth = window.speechSynthesis;
    let speech = new SpeechSynthesisUtterance();
    let voices = [];

    document.getElementById('speak').addEventListener('click', function(){
    let text = document.querySelector('#respuesta').innerText;
    speech.text = text;

    // Set the voice based on the language of the text
    let lang = 'en-US'; // Default to English (United States)
    if (text.match(/[áéíóúñüÁÉÍÓÚÑÜ]/)) { // Simple check for Spanish text
        lang = 'es-ES'; // Spanish (Spain)
    }

    // Find a voice that matches the language
    let voice = voices.find(voice => voice.lang === lang);
    if (voice) {
        speech.voice = voice;
    }

    synth.speak(speech);
});


    // Populate the voiceSelect with options
    function populateVoiceList() {
        voices = synth.getVoices();
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    document.getElementById('stop').addEventListener('click', function(){
        synth.cancel();
    });

    document.getElementById('voiceButton').addEventListener('click', function(){
        let voiceButtons = document.getElementById('voiceButtons');
        if (!voiceButtons) {
            voiceButtons = document.createElement('div');
            voiceButtons.id = 'voiceButtons';
            voiceButtons.style.position = 'absolute';
            voiceButtons.style.left = '75px';
            voiceButtons.style.zIndex = '999';
    
            for(let i = 0; i < voices.length ; i++) {
                // Only create buttons for English and Spanish voices
                if (voices[i].lang.startsWith('en') || voices[i].lang.startsWith('es')) {
                    let voiceButton = document.createElement('button');
                    voiceButton.id = 'voice-' + i; // Unique ID for each voice button
                    voiceButton.innerText = voices[i].name + ' (' + voices[i].lang + ')';
                    voiceButton.addEventListener('click', function(){
                        speech.voice = voices[i];
                    });
    
                    voiceButtons.appendChild(voiceButton);
                }
            }
    
            this.parentNode.insertBefore(voiceButtons, this.nextSibling);
        } else {
            voiceButtons.remove();
        }
    });
    


    document.getElementById('volumeButton').addEventListener('click', function(){
        let volumeButtons = document.getElementById('volumeButtons');
        if (!volumeButtons) {
            volumeButtons = document.createElement('div');
            volumeButtons.id = 'volumeButtons';
            volumeButtons.style.position = 'absolute';
            volumeButtons.style.left = '75px';
            volumeButtons.style.zIndex = '999';

            let lowButton = document.createElement('button');
            lowButton.id = 'low';
            lowButton.innerText = 'Low Volume';
            lowButton.addEventListener('click', function(){
                selectedVolume = 0.3; // Low volume
                speech.volume = selectedVolume;
            });

            let mediumButton = document.createElement('button');
            mediumButton.id = 'medium';
            mediumButton.innerText = 'Medium Volume';
            mediumButton.addEventListener('click', function(){
                selectedVolume = 0.6; // Medium volume
                speech.volume = selectedVolume;
            });

            let highButton = document.createElement('button');
            highButton.id = 'high';
            highButton.innerText = 'High Volume';
            highButton.addEventListener('click', function(){
                selectedVolume = 1; // High volume
                speech.volume = selectedVolume;
            });

            volumeButtons.appendChild(lowButton);
            volumeButtons.appendChild(mediumButton);
            volumeButtons.appendChild(highButton);

            this.parentNode.insertBefore(volumeButtons, this.nextSibling);
        } else {
            volumeButtons.remove();
        }
    });
}

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector("input");
const voiceSelect = document.querySelector("select");

const voices = synth.getVoices();

inputForm.onsubmit = (event) => {
  event.preventDefault();

  const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = selectedVolume; // Use the selected volume
  synth.speak(utterThis);
  inputTxt.blur();
};
