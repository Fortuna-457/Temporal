// Trivial JS
$(document).ready(function () {
    // Get the CSRF token
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Set the difficulty
    let difficulty;

    // Set the default points
    let max_points = 20;
    let medium_points = 15;
    let min_points = 10;
    
    // Set the array questions
    const questions = [];
    
    // Set the default highscore
    let highscore = 0;

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


    let confetti;

    function startConfetti() {
        // Show the confetti canvas
        document.getElementById('confetti-canvas').style.display = 'block';

        // Create a new ConfettiGenerator object
        const confettiSettings = {
            target: document.getElementById('confetti-canvas'),
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
            // Establecemos las puntuaciones en base a la dificultad
            max_points = response.max_points;
            medium_points = response.medium_points;
            min_points = response.min_points;

            $(".how-to-earn-points .time-1").text("+"+max_points);
            $(".how-to-earn-points .time-2").text("+"+medium_points);
            $(".how-to-earn-points .time-3").text("+"+min_points);

            // Establecemos el highscore, si es distinto de 0
            highscore = response.user_highscore;
            if (highscore > 0){
                $('#highscore').text(highscore);
            }
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

        updateIconClass();
    }

    function displayNewHighscoreMessage() {
        const newHighscoreMessage = $('<span>', {
            id: 'new-highscore-message',
            text: 'New Highscore!'
        }).hide(); // Initially hide the message
    
        $('.highscore-quiz').append(newHighscoreMessage);
    
        newHighscoreMessage.fadeIn(300, function() {
            setTimeout(() => {
                newHighscoreMessage.fadeOut(400, function() {
                    newHighscoreMessage.remove();
                });
            }, 3000);
        });
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
        const answerTime = timeRemaining;
        if (!isPaused) {
            if ($(`#answer-${index + 1}`).data('correct')) {
                let pointsEarned = 0;
                if (answerTime >= 15) {
                    pointsEarned = max_points;
                } else if (answerTime >= 10) {
                    pointsEarned = medium_points;
                } else {
                    pointsEarned = min_points;
                }
                score += pointsEarned;
                $('#currentScore').text(score);
                displayPointsEarned(pointsEarned);

                    if (score > highscore) {
                        highscore = score;
                        $('#highscore').text(highscore);
                        displayNewHighscoreMessage()
                
                }
            } else {
                endQuiz(false);
                return;
            }
        }
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
    
        if (won && score > highscore) {
            highscore = score;
            $.ajax({
                url: '/set-highscore/',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                data: JSON.stringify({
                    "highscore": highscore,
                }),
            })
            .fail(function (error) {
                console.error('Error:', error);
            });
    
            startConfetti();
            $('#modal-message').html(`Congratulations! You won!<br>Your Score: ${highscore}<br>NEW HIGHSCORE!`);
            $('#new-highscore-message').addClass("show-new-highscore-message");
            $('#new-highscore-message').css('display', 'inline');
        } else {
            if (won) {
                $('#modal-message').html(`<span class="win-message">Congratulations! You won!</span><br>Your Score: ${score}`);
            } else {
                const questionObj = questions[currentQuestionIndex];
                $('#modal-message').html(`<strong>${questionObj.question}</strong><br>Correct Answer: ${questionObj.correctAnswer}<br><br><span class="lost-message">You lost! Try again!</span><br>Your Score: ${score}`);
            }
        }
    
        isPaused = false;
        toggleAnswerInteraction(true);
        updateIconClass();
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

        if (score > highscore){
            $('#new-highscore-message').addClass("show-new-highscore-message");
            $('#new-highscore-message').css('display', 'inline');
            $('#highscore-modal #my_score').text('Your highscore: '+score);
        }else{
            $('#highscore-modal #my_score').text('Your highscore: '+highscore);
        }

        // Hide the paused message if it's displayed
        $('#paused-message').hide();

        // Mostramos los cincos usuarios con las puntuaciones más altas, de la modalidad escogida
        $.ajax({
            url: '/get-ranking/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken // Add the CSRF token as a header
            },
        })
        .done(function (response) { // Get the server response
            if (response) { // If it's not null, display it.
                $(".peoples-highscores").empty();
                response.ranking.forEach(user => {
                    let profilePictureUrl = user.profile_picture || "/static/img/profilePictures/def.jpg"; // Adjusted path
                    
                    // Create the user highscore div
                    let userHighscoreHtml = $('<div>', {class: 'user-highscore'});
                    
                    // Create the container for profile picture and username
                    let userInfoDiv = $('<div>').css({
                        'display': 'flex',
                        'align-items': 'center'
                    });
        
                    // Create the profile picture img with styles
                    let profilePicture = $('<img>', {
                        src: profilePictureUrl,
                        alt: 'Profile picture',
                        class: 'profile-picture',
                        css: {
                            'margin-right': '10px',
                            'width': '30px',
                            'height': '30px',
                            'border-radius': '50%'
                        }
                    });
        
                    let userName = $('<p>').text(response.active_user === user.username ? 'You' : user.username).css('margin', '0');
                    if (response.active_user === user.username) {
                        userName.addClass('active-user');
                    }
                    userInfoDiv.append(profilePicture).append(userName);
                    let userScore = $('<span>').text(user.highscore);
                    userHighscoreHtml.append(userInfoDiv).append(userScore);
                    $(".peoples-highscores").append(userHighscoreHtml);
                });
            }
        })
        .fail(function (error) {
            console.error('Error:', error);
        });
        

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