let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionContainer = document.getElementById('question');
const answerOptions = document.getElementById('answer-options');
const nextButton = document.getElementById('next-button');
const scoreDisplay = document.getElementById('score');

// Function to fetch quiz data from the API
async function fetchQuizQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error('Failed to fetch valid questions.');
        }

        questions = data.results;
        if (questions.length > 0) {
            loadQuestion();
        } else {
            throw new Error('No questions available.');
        }
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        questionContainer.innerText = 'Sorry, there was an issue loading the questions. Please try again later.';
        nextButton.style.display = 'none';  // Hide next button since no questions are available
    }
}

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Display question
    questionContainer.innerText = currentQuestion.question;

    // Clear previous options
    answerOptions.innerHTML = '';

    // Combine the correct answer with the wrong answers
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    // Shuffle the answers for randomness
    allAnswers.sort(() => Math.random() - 0.5);

    // Display options
    allAnswers.forEach((option, index) => {
        const li = document.createElement('li');
        li.innerText = option;
        li.onclick = () => checkAnswer(option);
        answerOptions.appendChild(li);
    });
}

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentQuestionIndex];

    // Check if the answer is correct
    if (selectedAnswer === currentQuestion.correct_answer) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    }

    // Disable further clicks on options
    const options = answerOptions.getElementsByTagName('li');
    Array.from(options).forEach(option => {
        option.style.pointerEvents = 'none';
    });

    // Enable next button
    nextButton.style.display = 'inline-block';
}

function nextQuestion() {
    // Move to the next question
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        nextButton.style.display = 'none'; // Hide next button until user selects an option
    } else {
        showResult();
    }
}

function showResult() {
    questionContainer.innerText = 'Quiz Finished!';
    answerOptions.innerHTML = '';
    nextButton.style.display = 'none';
    scoreDisplay.innerText = `Final Score: ${score}`;
}

fetchQuizQuestions();  // Fetch the quiz data when the page loads
