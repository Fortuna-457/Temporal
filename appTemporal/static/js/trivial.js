// Trivial JS
$(document).ready(function () {
    // Get the CSRF token
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Set the difficulty
    let difficulty;

    let max_points = 20;
    let medium_points = 15;
    let min_points = 10;

    if(localStorage.getItem("difficulty")){
        difficulty = localStorage.getItem("difficulty").toLowerCase();
        $(".different-settings-container .item-modal .form-check input[type='radio']").removeAttr("checked");
        $(".different-settings-container .item-modal .form-check #" + difficulty).attr("checked", "checked");
    }else{
        difficulty = $(".different-settings-container .item-modal .form-check").children('input[type="radio"]:checked').attr("id").toLowerCase();
    }

    $(".different-settings-container .item-modal .form-check").on('click', function (e) {
        var value = $(this).children('input[type="radio"]').first().attr("id");
        difficulty = localStorage.setItem("difficulty", value.toLowerCase());
        window.location.reload();
    });

    const questions = [];
    let highscore = 0;
    
    $.ajax({
        url: '/get-questions/',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': csrfToken // Add the CSRF token as a header
        },
        data: JSON.stringify({
            "difficulty": difficulty,
            "limit": 10,
        }), // Stringify the data object
    })
    .done(function (response) { // Get the server response
        if (response) { // If it's not null, display it.
            response.questions.forEach(question => {
                questions.push(question);
            });
            max_points = response.max_points;
            medium_points = response.medium_points;
            min_points = response.min_points;
        }
    })
    .fail(function (error) {
        console.error('Error:', error);
    });

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeRemaining = 20;
    let isPaused = false;
    let remainingTimeWhenPaused = 0;

    function startQuiz() {
        if (isPaused) {
            // Timer is paused, so resume it
            updateIconClass(); // Update icon class
            isPaused = false;
            startTimer();
        } else {
            // Timer is not paused, start it
            updateIconClass(); // Update icon class
            if (!timer) {
                currentQuestionIndex = 0;
                score = 0;
                timeRemaining = 20;
                $('#currentScore').text(score);
                loadQuestion();
                startTimer(); // Ensure timer starts when quiz starts
            }
        }
    }

    function updateIconClass() {
        const startQuizIcon = $('#start-quiz i');
        if (isPaused) {
            startQuizIcon.removeClass('bx-play').addClass('bx-pause');
        } else {
            startQuizIcon.removeClass('bx-pause').addClass('bx-play');
        }
    }

    function startTimer() {
        clearInterval(timer); // Clear any existing interval
        timer = setInterval(() => {
            if (!isPaused && timeRemaining > 0) {
                timeRemaining--;
                $('#time-remaining').text(timeRemaining);
            } else if (timeRemaining === 0) {
                endQuiz(false);
            }
        }, 1000);
        $('#start-quiz i').removeClass('bx-play').addClass('bx-pause'); // Update icon class
    }

    function pauseTimer() {
        if (!isPaused) {
            clearInterval(timer);
            remainingTimeWhenPaused = timeRemaining;
            isPaused = true;
            toggleAnswerInteraction(false); // Disable answer interaction
            $('#start-quiz i').removeClass('bx-pause').addClass('bx-play'); // Update icon class
    
            // Show the "Quiz Paused" message
            const pausedMessage = $('#paused-message');
            pausedMessage.css('display', 'block');
    
        } else {
            isPaused = false;
            timeRemaining = remainingTimeWhenPaused;
            $('#time-remaining').text(timeRemaining); // Update the time remaining immediately
            toggleAnswerInteraction(true); // Enable answer interaction
            startTimer(); // Resume the timer
    
            // Hide the "Quiz Paused" message
            const pausedMessage = $('#paused-message');
            pausedMessage.css('display', 'none');
        }
    }
    

    function resetTimer() {
        clearInterval(timer);
        timeRemaining = 20;
        $('#time-remaining').text(timeRemaining);
        startTimer();
    }

    function loadQuestion() {
        const questionObj = questions[currentQuestionIndex];
        const question = questionObj.question;
        let answers = questionObj.answers.slice();

        // Shuffle answers
        answers = answers.sort(() => Math.random() - 0.5);

        $('#question-text h4').text(question);
        answers.forEach((answer, index) => {
            $(`#answer-${index + 1}`).html(`<p>${answer.text}</p>`);
            if (answer.text === questionObj.correctAnswer) {
                $(`#answer-${index + 1}`).data('correct', true);
            } else {
                $(`#answer-${index + 1}`).data('correct', false);
            }
        });

        updateIconClass(); // Update icon class based on timer state
    }

    function displayPointsEarned(points) {
        const pointsEarnedDiv = $('<div>', {
            text: `+${points}`,
            class: 'points-earned'
        }).css('opacity', 1); // Set initial opacity to 1

        $('.points-quiz').append(pointsEarnedDiv); // Append to .points-quiz container

        setTimeout(() => {
            pointsEarnedDiv.animate({ opacity: 0 }, 500, function () {
                pointsEarnedDiv.remove();
            });
        }, 1000); // Fade out after 1 second
    }

    function checkAnswer(index) {
        const answerTime = timeRemaining; // Use the counter number
        // Check if the timer is not paused
        if (!isPaused) {
            if ($(`#answer-${index + 1}`).data('correct')) {
                let pointsEarned = 0;
                if (answerTime >= 15) { // max_points - 5 = 15
                    pointsEarned = max_points;
                } else if (answerTime >= 10) { // max_points - 10 = 10
                    pointsEarned = medium_points;
                } else {
                    pointsEarned = min_points;
                }
                score += pointsEarned;
                $('#currentScore').text(score);
                displayPointsEarned(pointsEarned); // Display the points earned
                // Update highscore if current score is higher
                if (score > highscore) {
                    console.log("New Highscore achieved");
                    highscore = score;
                    localStorage.setItem('highscore', highscore);
                    $('#highscore').text(highscore);
                    console.log("Updated Highscore:", highscore);
                }
            } else {
                // If the answer is incorrect, end the quiz
                endQuiz(false);
                return; // Exit the function early to prevent proceeding to the next question
            }
        }
        // Proceed to the next question regardless of whether the timer is paused
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
            resetTimer();
        } else {
            endQuiz(true);
        }
    }

let confetti;

function startConfetti() {
    // Show the confetti canvas
    document.getElementById('confetti-canvas').style.display = 'block';

    // Create a new ConfettiGenerator object
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
        clock: 25
    };
    
    confetti = new ConfettiGenerator(confettiSettings);

    // Start the confetti
    confetti.render();
}

    function endQuiz(won) {
        clearInterval(timer);
        $('#quiz-modal').show();
        if (score > highscore) {
            highscore = score;
            // Guardamos la nueva highscore en el server
            $.ajax({
                url: '/set-highscore/',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken // Add the CSRF token as a header
                },
                data: JSON.stringify({
                    "highscore": highscore,
                }), // Stringify the data object
            })
            .fail(function (error) {
                console.error('Error:', error);
            });

            $('#highscore').text(highscore);
            $('#modal-message').html(`Congratulations! You won!<br>Your Score: ${score}<br>NEW HIGHSCORE!`);
        } else {
            if (won) {
                startConfetti();
                $('#modal-message').html(`<span class="win-message">Congratulations! You won!</span><br>Your Score: ${score}`);
            } else {
                const questionObj = questions[currentQuestionIndex];
                $('#modal-message').html(`<strong>${questionObj.question}</strong><br>Correct Answer: ${questionObj.correctAnswer}<br><br><span class="lost-message">You lost! Try again!</span><br>Your Score: ${score}`);
            }
        }
        isPaused = false; // Ensure timer is not paused when the quiz ends
        toggleAnswerInteraction(true); // Ensure answer interaction is enabled
        updateIconClass(); // Update icon class
    }

    $('#start-quiz').off('click').on('click', function () {
        $('#paused-message').css('display', 'none');
        if (timer) {
            // Timer is running, so pause it
            updateIconClass(); // Update icon class
            pauseTimer();
        } else {
            // Timer is not running, so start it
            updateIconClass(); // Update icon class
            startQuiz(); // Start or resume the quiz
        }
    });

    // Refresh event
    $('.refresh').on('click', function () {
        $('#quiz-modal').hide();

        if (confetti) {
            confetti.clear();
        }
    
        // Hide the confetti canvas
        document.getElementById('confetti-canvas').style.display = 'none';
        // Reset the current score to 0
        score = 0;
        $('#currentScore').text(score);

        // Reset the timer and time remaining
        clearInterval(timer);
        timeRemaining = 20;
        $('#time-remaining').text(timeRemaining);
        timer = null;

        // Reset the question index
        currentQuestionIndex = 0;

        // Hide any open modal
        $('.modal').hide();

        // Set the icon class to "bx-pause" directly
        $('#start-quiz i').removeClass('bx-play').addClass('bx-pause');

        // Show the "Quiz Refreshed" message in the middle of the screen for 1 second
        const refreshMessage = $('<div>', {
            text: 'Quiz Refreshed',
            class: 'refresh-message'
        }).appendTo('body');

        // Center the message in the middle of the screen
        refreshMessage.css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            zIndex: '1000',
            color: 'black',
            transition: 'all 0.2s ease'
        });

        refreshMessage.fadeOut(1000);

        // Remove the message after 1 second
        setTimeout(() => {
            refreshMessage.remove();
        }, 1000);
    });

    function toggleAnswerInteraction(enable) {
        if (enable) {
            $('.answer-quiz').removeClass('disabled');
            $('.answer-quiz p').removeClass('disabled');
        } else {
            $('.answer-quiz').addClass('disabled');
            $('.answer-quiz p').addClass('disabled');
        }
    }

    // Modal close event
    $('.close-modal, .refresh').on('click', function () {
        $('#quiz-modal').hide();
        startQuiz();
    });

    // Event listener for answer buttons
    $('.answer-quiz').on('click', function () {
        if (!isPaused) { // Only allow answer selection if the timer is not paused
            const index = $(this).attr('id').split('-')[1] - 1;
            checkAnswer(index);
        }
    });

    // Show modal
    $('#start-modal').show();

    // Event listener for info-modal button click
    $('#info-quiz').on('click', function () {
        const infoModal = $('#info-modal');
        const wasPausedBeforeInfo = isPaused; // Remember whether the quiz was paused before opening the info modal
        pauseTimer(); // Pause the timer when info modal is displayed
        isPaused = true; // Update isPaused flag to ensure the timer stays paused
        toggleAnswerInteraction(false); // Disable answer interaction
        infoModal.show();

        // Hide the paused message if it's displayed
        $('#paused-message').hide();

        // Event listener for close button in info modal
        function closeModal() {
            infoModal.hide();
            if (!wasPausedBeforeInfo) {
                isPaused = false; // Update isPaused flag to resume the timer only if it wasn't paused before opening the info modal
                startTimer(); // Resume the timer when modal is closed only if it wasn't paused before opening the info modal
            }
            toggleAnswerInteraction(true); // Enable answer interaction when modal is closed
            $('.close-modal').off('click', closeModal); // Remove the event listener
        }

        // Add event listener for close button in info modal
        $('.close-modal').one('click', closeModal);
    });

    // Close modal when close button is clicked
    $('.close-modal').on('click', function () {
        const infoModal = $('#info-modal');
        infoModal.hide();
        if (!isPaused) {
            startTimer(); // Resume the timer only if it wasn't paused before opening the info modal
        }
        
        // Reset z-index of questions container to ensure it appears above other elements
        $('.questions-container').css('z-index', 'auto');
        
        // Remove the 'disabled' class from answer buttons
        $('.answer-quiz').removeClass('disabled');
        $('.answer-quiz p').removeClass('disabled');
    });


    // Start quiz modal button click event
    $('#start-quiz-modal').off('click').on('click', function () {
        $('#start-modal').hide();
        startQuiz(); // Start the quiz
    });

    // Close modal when close button is clicked
    $('.close-modal').on('click', function () {
        $('#start-modal').hide();
    });

    const colors = ['#3f004f', '#4f002e', '#2a004f', '#590082'];
    $('.answer-quiz p').each(function () {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        $(this).css('background-color', randomColor);
    });

    $('#highscore-modal-trigger').on('click', function() {
        const wasPausedBeforeHighscore = isPaused; // Remember if the timer was paused before opening the highscore modal
        pauseTimer(); // Pause the timer when the highscore modal is displayed
        isPaused = true; // Update isPaused flag to ensure the timer stays paused
        toggleAnswerInteraction(false); // Disable answer interaction
        $('#highscore-modal').show();

        // Hide the paused message if it's displayed
        $('#paused-message').hide();

        // Event listener for close button in highscore modal
        function closeHighscoreModal() {
            $('#highscore-modal').hide();
            if (!wasPausedBeforeHighscore) {
                isPaused = false; // Update isPaused flag to resume the timer only if it wasn't paused before opening the highscore modal
                startTimer(); // Resume the timer when the modal is closed only if it wasn't paused before
            }
            toggleAnswerInteraction(true); // Enable answer interaction when the modal is closed
            $('.close-modal').off('click', closeHighscoreModal); // Remove the event listener
        }

        // Add event listener for close button in highscore modal
        $('.close-modal').one('click', closeHighscoreModal);
    });

    // Event listener for cog icon click to open settings modal
    $('.box-icon-quiz.cog').on('click', function() {
        // Remember if the timer was paused before opening the settings modal
        const wasPausedBeforeSettings = isPaused;
        pauseTimer(); // Pause the timer when the settings modal is opened
        isPaused = true; // Update isPaused flag to ensure the timer stays paused
        toggleAnswerInteraction(false); // Disable answer interaction
        $('#settingsModal').show();

        // Hide the paused message if it's displayed
        $('#paused-message').hide();

        // Event listener for close button in settings modal
        function closeSettingsModal() {
            $('#settingsModal').hide();
            if (!wasPausedBeforeSettings) {
                isPaused = false; // Update isPaused flag to resume the timer only if it wasn't paused before opening the settings modal
                startTimer(); // Resume the timer when the modal is closed only if it wasn't paused before
            }
            toggleAnswerInteraction(true); // Enable answer interaction when the modal is closed
            $('.close-modal').off('click', closeSettingsModal); // Remove the event listener
        }

        // Add event listener for close button in settings modal
        $('.close-modal').one('click', closeSettingsModal);
    });


    // Event listener for close button in settings modal
    $('#settingsModal .close-modal').on('click', function() {
        $('#settingsModal').hide();
        if (!isPaused) {
            startTimer(); // Resume the timer if it wasn't paused before
        }
    });

    // Event listener to close settings modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == $('#settingsModal')[0]) {
            $('#settingsModal').hide();
            if (!isPaused) {
                startTimer(); // Resume the timer if it wasn't paused before
            }
        }
    };

});