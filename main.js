import './style.css'

// Create the main application structure
document.querySelector('#app').innerHTML = `
  <div class="fact-container">
    <h1>Random Fact Generator</h1>
    <button id="fact-button" type="button">Get a Random Fact</button>
    <div id="loading" class="loading hidden">Fetching your fact...</div>
    <div id="fact-display" class="fact-display"></div>
    <div id="error-message" class="error-message hidden"></div>
  </div>
`

// API endpoint for random facts
const API_URL = 'https://catfact.ninja/fact'

// Get DOM elements
const button = document.querySelector('#fact-button')
const loading = document.querySelector('#loading')
const factDisplay = document.querySelector('#fact-display')
const errorMessage = document.querySelector('#error-message')

// Function to show loading state
function showLoading() {
  loading.classList.remove('hidden')
  button.disabled = true
  button.textContent = 'Loading...'
  errorMessage.classList.add('hidden')
}

// Function to hide loading state
function hideLoading() {
  loading.classList.add('hidden')
  button.disabled = false
  button.textContent = 'Get a Random Fact'
}

// Function to display error
function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
  factDisplay.innerHTML = ''
}

// Function to display fact
function displayFact(fact) {
  factDisplay.innerHTML = `
    <div class="fact-card">
      <p class="fact-text">"${fact}"</p>
      <div class="fact-footer">
        <small>Click the button for another fact!</small>
      </div>
    </div>
  `
  errorMessage.classList.add('hidden')
}

// Async function to fetch random fact
async function fetchRandomFact() {
  showLoading()
  
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.fact) {
      displayFact(data.fact)
    } else {
      throw new Error('Invalid response format')
    }
    
  } catch (error) {
    console.error('Error fetching fact:', error)
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showError('Network error: Please check your internet connection and try again.')
    } else if (error.message.includes('HTTP error')) {
      showError('Server error: The fact service is temporarily unavailable.')
    } else {
      showError('Something went wrong while fetching your fact. Please try again.')
    }
  } finally {
    hideLoading()
  }
}

// Add event listener to button
button.addEventListener('click', fetchRandomFact)

// Optional: Fetch a fact on page load
window.addEventListener('load', fetchRandomFact)