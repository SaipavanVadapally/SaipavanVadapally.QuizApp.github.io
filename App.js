const questionData = [
	{
		questionText: 'Commonly used data types DO NOT include:',
		options: ['1. strings', '2. booleans', '3. alerts', '4. numbers'],
		answerIndex: 2
	},
	{
		questionText: 'Arrays in JavaScript can be used to store ______.',
		options: [
			'1. numbers and strings',
			'2. other arrays',
			'3. booleans',
			'4. all of the above'
		],
		answerIndex: 3
	},
	{
		questionText:
			'String values must be enclosed within _____ when being assigned to variables.',
		options: [
			'1. commas',
			'2. curly brackets',
			'3. quotes',
			'4. parentheses'
		],
		answerIndex: 2
	},
	{
		questionText:
			'A very useful tool used during development and debugging for printing content to the debugger is:',
		options: [
			'1. JavaScript',
			'2. terminal/bash',
			'3. for loops',
			'4. console.log'
		],
		answerIndex: 3
	},
	{
		questionText:
			'Which of the following is a statement that can be used to terminate a loop, switch or label statement?',
		options: ['1. break', '2. stop', '3. halt', '4. exit'],
		answerIndex: 0
	}
]

let currentQuestionIndex = 0
let score = 0
let timer = 2 * 60 // Set timer for each question (2 minutes)
let userName = '' // New variable to store user's name

const startQuizButton = document.getElementById('startQuiz')
const quizIntro = document.getElementById('quizIntro')
const quizContent = document.getElementById('quizContent')
const leaderboardLink = document.getElementById('leaderboard')
const leaderboardContent = document.getElementById('leaderboardContent')
const questionText = document.getElementById('questionText')
const optionsContainer = document.getElementById('optionsContainer')
const nextQuestionButton = document.getElementById('nextQuestion')

startQuizButton.addEventListener('click', startQuiz)
leaderboardLink.addEventListener('click', showLeaderboard)

function startQuiz() {
	quizIntro.style.display = 'none'
	quizContent.style.display = 'block'
	userName = prompt('Enter your name:') // Prompt user for name
	startTimer() // Start the timer
	displayQuestion() // Add this line to display the first question
}

function startTimer() {
	// Reset the timer for each question
	timer = 2 * 60

	const timerInterval = setInterval(() => {
		timer-- // Decrement timer by 1 second
		if (timer <= 0) {
			clearInterval(timerInterval) // Stop the timer
			showCompletedPage()
		}
	}, 1000)
}

async function displayQuestion() {
	startTimer() // Start the timer for the current question

	const currentQuestion = questionData[currentQuestionIndex]
	questionText.textContent = currentQuestion.questionText

	// Clear existing options
	optionsContainer.innerHTML = ''

	// Create buttons for each option
	for (let index = 0; index < currentQuestion.options.length; index++) {
		const option = currentQuestion.options[index]
		const optionButton = document.createElement('button')
		optionButton.textContent = option
		optionButton.addEventListener('click', () => handleOptionClick(index))
		optionsContainer.appendChild(optionButton)
	}
}

async function handleOptionClick(selectedIndex) {
	const currentQuestion = questionData[currentQuestionIndex]

	// Check if the selected option is correct
	if (selectedIndex === currentQuestion.answerIndex) {
		// Increase score for correct answer
		score++
		await displayAnswerState('Correct!')
	} else {
		// Decrement score for incorrect answer
		score = Math.max(0, score - 10)
		await displayAnswerState('Incorrect!')
	}

	// Move to the next question after a delay
	await new Promise((resolve) => setTimeout(resolve, 1000))

	currentQuestionIndex++

	if (currentQuestionIndex < questionData.length) {
		// Display the next question
		displayQuestion()
	} else {
		// Quiz completed, show the score and other actions
		showCompletedPage()
	}
}

async function displayAnswerState(state) {
	const answerState = document.createElement('p')
	answerState.textContent = state
	optionsContainer.appendChild(answerState)

	// Display the state for 1 second and then remove it
	await new Promise((resolve) => setTimeout(resolve, 1000))
	answerState.remove()
}

function showCompletedPage() {
	// Save user's name and score to local storage
	const leaderboardData =
		JSON.parse(localStorage.getItem('leaderboard')) || []
	leaderboardData.push({ name: userName, score })
	localStorage.setItem('leaderboard', JSON.stringify(leaderboardData))

	// Display the leaderboard
	displayLeaderboard(leaderboardData)

	// Quiz completed, show the score and other actions
	quizContent.innerHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score} out of ${questionData.length}</p>`

	// Add a reset button
	const resetButton = document.createElement('button')
	resetButton.textContent = 'Reset Quiz'
	resetButton.addEventListener('click', resetQuiz)
	quizContent.appendChild(resetButton)

	// Show leaderboard content
	leaderboardContent.style.display = 'block'
}

function displayLeaderboard(leaderboardData) {
	const leaderboardContainer = document.getElementById('leaderboardContainer')
	leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>'

	if (leaderboardData.length > 0) {
		leaderboardData.forEach((entry) => {
			leaderboardContainer.innerHTML += `<p>${entry.name}: ${entry.score}</p>`
		})
	} else {
		leaderboardContainer.innerHTML += '<p>No entries yet</p>'
	}
}

function resetQuiz() {
	// Reset the quiz by reloading the page
	location.reload()
}
