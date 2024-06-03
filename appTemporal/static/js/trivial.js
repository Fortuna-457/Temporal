$(document).ready(function () {

    // Get the CSRF token
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
    // Set the difficulty
    let difficulty = "normal".toLowerCase(); // Sustituir normal por el valor de los ajustes del modo trivial

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
            $('#start-quiz i').removeClass('bx-pause').addClass('bx-play'); // Update icon class
        } else {
            isPaused = false;
            timeRemaining = remainingTimeWhenPaused;
            $('#time-remaining').text(timeRemaining); // Update the time remaining immediately
            startTimer(); // Resume the timer
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
                if (answerTime >= 15) { // 20 - 5 = 15
                    pointsEarned = 20;
                } else if (answerTime >= 10) { // 20 - 10 = 10
                    pointsEarned = 15;
                } else {
                    pointsEarned = 10;
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
        }
        if (won) {
            $('#modal-message').html(`Congratulations! You won!<br>Your Score: ${score}${score > highscore ? "<br>NEW HIGHSCORE!" : ""}`);
        } else {
            const questionObj = questions[currentQuestionIndex];
            $('#modal-message').html(`<strong>${questionObj.question}</strong><br>Correct Answer: ${questionObj.correctAnswer}<br><br>You lost. Try again!<br>Your Score: ${score}`);
        }
        isPaused = false; // Ensure timer is not paused when the quiz ends
        updateIconClass(); // Update icon class
    }


    $('#start-quiz').off('click').on('click', function () {
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



    // Modal close event
    $('.close-modal, .refresh').on('click', function () {
        $('#quiz-modal').hide();
        startQuiz();
    });

    // Event listener for answer buttons
    $('.answer-quiz').on('click', function () {
        const index = $(this).attr('id').split('-')[1] - 1;
        checkAnswer(index);
    });

    // Show modal
    $('#start-modal').show();

    // Event listener for info-modal button click
    $('#info-quiz').on('click', function () {
        const infoModal = $('#info-modal');
        pauseTimer(); // Pause the timer when info modal is displayed
        infoModal.show();
    });

    // Close modal when close button is clicked
    $('.close-modal').on('click', function () {
        const infoModal = $('#info-modal');
        infoModal.hide();
        if (!isPaused) {
            startTimer(); // Resume the timer when modal is closed
        }
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
});
