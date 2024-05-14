window.onload = function() {
    let selectedVolume = 1; // Default volume
    let synth = window.speechSynthesis;
    let speech = new SpeechSynthesisUtterance();
    let voices = [];

    synth.onvoiceschanged = function() {
        voices = synth.getVoices();
    };

    document.getElementById('speak').addEventListener('click', function(){
        let text = document.querySelector('#respuesta').innerText;
        speech.text = text;

        let lang = 'en-US'; // Default to English (United States)
        if (text.match(/[áéíóúñüÁÉÍÓÚÑÜ]/)) { // Simple check for Spanish text
            lang = 'es-ES'; // Spanish (Spain)
        }

        let voice = voices.find(voice => voice.lang === lang);
        if (voice) {
            speech.voice = voice;
        }

        speech.volume = selectedVolume;
        synth.speak(speech);
    });

    let mybutton = document.getElementById("myBtn");
    let offcanvasBody = document.querySelector('.offcanvas-body');

    mybutton.style.display = "none";

    offcanvasBody.onscroll = function() {
        mybutton.style.display = offcanvasBody.scrollTop > 20 ? "block" : "none";
    };

    mybutton.onclick = function() {
        offcanvasBody.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('stop').addEventListener('click', function(){
        synth.cancel();
    });

    document.getElementById('volumeButton').addEventListener('click', function(){
        let volumeButtons = document.getElementById('volumeButtons');
        if (!volumeButtons) {
            volumeButtons = document.createElement('div');
            volumeButtons.id = 'volumeButtons';
            volumeButtons.style.position = 'absolute';
            volumeButtons.style.left = '75px';
            volumeButtons.style.zIndex = '999';
            volumeButtons.style.top = '195px';

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

    document.getElementById('voiceButton').addEventListener('click', function(){
        let voiceButtons = document.getElementById('voiceButtons');
        if (!voiceButtons) {
            voiceButtons = document.createElement('div');
            voiceButtons.id = 'voiceButtons';
            voiceButtons.style.position = 'absolute';
            voiceButtons.style.left = '75px';
            voiceButtons.style.zIndex = '999';
            voiceButtons.style.top = '55px';
            voiceButtons.style.overflowY = 'auto';
            voiceButtons.style.height= '100%';

            for(let i = 0; i < voices.length ; i++) {
                if (voices[i].lang.startsWith('en') || voices[i].lang.startsWith('es')) {
                    let voiceButton = document.createElement('button');
                    voiceButton.id = 'voice-' + i;
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
}
