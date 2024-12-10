// Function to scroll the page to the next element
function scrollToNextElement(currentElement) {
    const nextElement = currentElement.nextElementSibling;
    if (nextElement && nextElement.classList.contains('center-container')) {
        nextElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // Scroll to the center of the next element
        });
    }
}

// Get all "Continue" buttons
const continueButtons = document.querySelectorAll('.continue-btn');

continueButtons.forEach(button => {
    button.addEventListener('click', function () {
        const currentContainer = button.closest('.center-container');
        scrollToNextElement(currentContainer);
    });
});
