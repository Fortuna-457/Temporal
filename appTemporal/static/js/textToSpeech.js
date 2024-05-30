window.onload = function() {
    let selectedVolume = 1; // Default volume
    let synth = window.speechSynthesis;
    let speech = new SpeechSynthesisUtterance();
    let voices = [];

    synth.onvoiceschanged = function() {
        voices = synth.getVoices();
        console.log('Voices loaded:', voices); 
    };

    
    document.getElementById('speak').addEventListener('click', function(){
        console.log("speak: clicked");
        let text = document.querySelector('#respuesta').innerText;
        console.log('Text to speak:', text); // Add this line
        if (text) {
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
        } else {
            console.log('No text to speak');
        }
    });;


    let offcanvasBody = document.querySelector('.offcanvas-body');

    document.getElementById('stop').addEventListener('click', function(){
        console.log("stop: clicked");
        synth.cancel();
    });

    document.getElementById('volumeButton').addEventListener('click', function(){
        console.log("volumeButton: clicked");
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
        }
    });

    document.getElementById('voiceButton').addEventListener('click', function(){
        console.log("voiceButton: clicked");
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
        }
    });
}
