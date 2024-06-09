$(document).ready(function () {
    /******************************************** */
    /******************************************** */
    /******************************************** */
    /******************************************** */
    /******* TEXT TO SPEECH PART **************** */
    /******************************************** */
    /******************************************** */
    /******************************************** */
    /******************************************** */

    // Initialize the tooltip
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    let selectedVolume = 1; // Default volume
    let synth = window.speechSynthesis;
    let speech = new SpeechSynthesisUtterance();
    let voices = [];

    synth.onvoiceschanged = function () {
        voices = synth.getVoices();
        // Set speech.voice to the default voice
        speech.voice = voices.find(voice => voice.default);
        console.log('Voices loaded:', voices);
    };

    document.getElementById('volumeSlider').addEventListener('input', function () {
        selectedVolume = this.value;
        speech.volume = selectedVolume;
    });

    document.querySelector('.offcanvas-body').addEventListener('click', function (event) {
        if (event.target.matches('.volume-icon')) {
            if (synth.speaking) {
                // If the speech synthesis is speaking, stop it
                synth.cancel();
            } else {
                console.log("speak: clicked");

                // Navigate to the parent bubble of the clicked volume icon
                let bubble = event.target.closest('.bubble');

                // Get the text inside this bubble
                let text = bubble.innerText;

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
            }
        }
    });

    document.getElementById('voiceButton').addEventListener('click', function () {
        let voiceListContainer = document.getElementById('voiceListContainer');

        // Toggle the voice list container
        if (voiceListContainer.style.display === 'none' || voiceListContainer.style.display === '') {
            voiceListContainer.style.display = 'block';

            // Clear the voice list container
            voiceListContainer.innerHTML = '';

            // Create the voice list
            let voiceList = document.createElement('ul');
            for (let i = 0; i < voices.length; i++) {
                let voiceItem = document.createElement('li');
                let isSelected = speech.voice && voices[i].voiceURI === speech.voice.voiceURI;
                voiceItem.innerText = voices[i].name + ' (' + voices[i].lang + ')' + (isSelected ? ' (selected)' : '');
                if (isSelected) {
                    voiceItem.classList.add('selected-voice');
                }
                voiceItem.addEventListener('click', function () {
                    speech.voice = voices[i];
                    // Update the list to reflect the new selection
                    Array.from(voiceListContainer.getElementsByTagName('li')).forEach((item, index) => {
                        item.classList.remove('selected-voice');
                        item.innerText = voices[index].name + ' (' + voices[index].lang + ')' + (index === i ? ' (selected)' : '');
                        if (index === i) {
                            item.classList.add('selected-voice');
                        }
                    });
                });
                voiceList.appendChild(voiceItem);
            }
            voiceListContainer.appendChild(voiceList);
        } else {
            voiceListContainer.style.display = 'none';
        }
    });

    document.getElementById('mapSettings').addEventListener('click', function () {
        // Show the modal
        let settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
        settingsModal.show();
    });
});