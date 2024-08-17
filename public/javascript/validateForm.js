document.querySelector('.validate-form').addEventListener('submit', function (event) {
    const form = event.target;
    let isValid = true;

    // Helper function to show/hide error messages
    function validateField(fieldId, errorMessageId) {
        const field = document.getElementById(fieldId);
        const errorMessage = document.getElementById(errorMessageId);
        if (!field.checkValidity()) {
            errorMessage.classList.remove('hidden');
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            errorMessage.classList.add('hidden');
            field.classList.remove('border-red-500');
        }
    }

    validateField('title', 'titleError');
    validateField('image', 'imageError');
    validateField('prepTime', 'prepTimeError');
    validateField('cookTime', 'cookTimeError');
    validateField('ingredients', 'ingredientsError');
    validateField('cusine', 'cusineError');
    validateField('category', 'categoryError');
    validateField('instruction', 'instructionError');

    if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
    }
});