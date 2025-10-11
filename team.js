document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navbar Sticky & Scroll Animation
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#navbar nav');
    const applyButtons = document.querySelectorAll('a[href="#application-form"]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked (on mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ----------------------------------------------------
    // 2. FAQ Accordion Toggle
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other open answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });


    // ----------------------------------------------------
    // 3. Form Submission Logic (Connect to Google Sheets)
    // ----------------------------------------------------
    const form = document.getElementById('cleaner-application-form');
    const submissionStatus = document.getElementById('submission-status');
    const formLoader = document.getElementById('form-loader');
    const formSuccess = document.getElementById('form-success');
    
    // !!! IMPORTANT: REPLACE WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL !!!
    const scriptURL = 'YOUR_GOOGLE_SHEETS_APPS_SCRIPT_WEBHOOK_URL_HERE';

    form.addEventListener('submit', e => {
        e.preventDefault();

        // 1. Show loader overlay and hide success/error messages
        submissionStatus.classList.remove('hidden');
        formLoader.classList.remove('hidden');
        formSuccess.classList.add('hidden');
        form.style.visibility = 'hidden'; // Visually hide the form content

        // Simulate a network delay for the user experience (optional)
        const delay = 1500; 

        // 2. Submit data
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                // Wait for the simulated delay
                setTimeout(() => {
                    formLoader.classList.add('hidden'); // Hide loader

                    if (response.ok) {
                        // Success
                        formSuccess.classList.remove('hidden');
                        form.reset(); // Clear the form
                        
                        // Optional: Hide success message and form container after 5 seconds
                        setTimeout(() => {
                            submissionStatus.classList.add('hidden');
                            form.style.visibility = 'visible';
                        }, 5000);
                        
                    } else {
                        // Error handling
                        console.error('Submission failed!', response);
                        submissionStatus.classList.add('hidden');
                        form.style.visibility = 'visible';
                        alert('An error occurred during submission. Please try again or contact us directly.');
                    }
                }, delay);
            })
            .catch(error => {
                // Network error
                console.error('Error!', error.message);
                
                // Restore form elements
                submissionStatus.classList.add('hidden');
                form.style.visibility = 'visible'; 
                alert('A network error occurred. Please check your connection and try again.');
            });
    });
});