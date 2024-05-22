document.addEventListener('DOMContentLoaded', function () {
    const resultsBox = document.getElementById('resultsBox');
    const checkoutButton = document.getElementById('checkoutButton');
    
    // Initially disable the checkout button
    checkoutButton.classList.remove('enabled');
   
    resultsBox.addEventListener('click', function () {
        // Toggle the selected class on the results box
        this.classList.toggle('selected');

        // Enable the checkout button if the box is selected, otherwise disable it
        if (this.classList.contains('selected')) {
            checkoutButton.classList.add('enabled');

        } else {
            checkoutButton.classList.remove('enabled');
        }
    });
});