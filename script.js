document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader Animation
    const preloader = document.getElementById('preloader');
    
    // Hide the preloader once the page content has fully loaded
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Wait for the fade-out transition
    });


    // 2. Sticky Navbar Glassmorphism
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 3. Hero Section Parallax (Subtle motion on mouse move)
    const hero = document.getElementById('hero');
    const heroOverlay = document.querySelector('.hero-gradient-overlay');

    hero.addEventListener('mousemove', (e) => {
        // Calculate the center point of the hero section
        const centerX = hero.offsetWidth / 2;
        const centerY = hero.offsetHeight / 2;
        
        // Calculate movement strength (0.01 is a subtle factor)
        const moveX = (e.clientX - centerX) * 0.01;
        const moveY = (e.clientY - centerY) * 0.01;

        // Apply a subtle transformation to the gradient overlay
        heroOverlay.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // 4. Contact Form Submission Handling
    const quoteForm = document.getElementById('quote-form');
    const successMessage = document.getElementById('success-message');

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real application, this is where you'd send data to a server (API call)

        // Simulate form submission and show success message
        quoteForm.style.display = 'none';
        successMessage.classList.remove('hidden');

        // Optional: Reset form after a few seconds
        setTimeout(() => {
            quoteForm.reset();
            successMessage.classList.add('hidden');
            quoteForm.style.display = 'block';
        }, 5000); 
    });

    const serviceCards = document.querySelectorAll(".service-card");

    // 2. Define the function that handles the redirection
    const redirectToCatalog = () => {
        // Use window.location.href to change the current URL
        window.location.href = "catalog.html";
    };

    // 3. Attach the click event listener to each service card
    serviceCards.forEach(card => {
        card.addEventListener('click', redirectToCatalog);
    });

    // Note: If this function is intended for the homepage,
    // and 'catalog.html' is your *Service Catalog* page, 
    // the redirection will successfully load that page.


     // ... (Existing variables like navBar, etc.) ...
    
    // NEW: Counter Animation Function
    function countUp(targetElement, finalValue, duration = 2000) {
        let startValue = 0;
        const startTime = performance.now();
        const step = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
            const currentValue = Math.floor(progress * finalValue);
            
            targetElement.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // NEW: Intersection Observer to trigger the animation on scroll
    const customerCountElement = document.getElementById('customer-count');
    const reviewsSection = document.getElementById('reviews');

    // Use a flag to ensure the animation only runs once
    let hasAnimated = false;

    if (reviewsSection && customerCountElement) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Check if the target is intersecting (visible) and hasn't animated yet
                if (entry.isIntersecting && !hasAnimated) {
                    // Start the count animation: target 1000, duration 2 seconds (2000ms)
                    countUp(customerCountElement, 1000, 2000);
                    hasAnimated = true; // Set flag
                    observer.unobserve(entry.target); // Stop observing once done
                }
            });
        }, observerOptions);

        observer.observe(reviewsSection);
    }
    


           /* submitting form */

// Get necessary elements
const form = document.forms['submit-to-google-sheet'];
const submissionLoader = document.getElementById('submission-loader');
let successMessage1 = document.getElementById('success-message');
let quoteForm1 = document.getElementById('quote-form'); // Use the form ID
// const scriptURL = 'sheet file will be here '; // Your actual sheet URL

// Your form submission logic
form.addEventListener('submit', e => {
    e.preventDefault();

    // 1. SHOW LOADER and HIDE FORM
    quoteForm1.classList.add('hidden');
    successMessage1.classList.add('hidden'); // Ensure success message is hidden
    submissionLoader.classList.remove('hidden');

    // MOCK SUBMISSION (Replace this block with your actual fetch call)
    // --- START MOCK ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzfUuI8Y5103VEXmHDnU6aqoZYWoPm2J3ciEnv1K-ltG-HSHsTb0Pt1wmIEDHcC-RNE/exec'; // Replace with actual URL
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    // --- END MOCK ---
    
    .then(response => {
        if (response.ok) {
            // 2. SUCCESS: HIDE LOADER, SHOW SUCCESS MESSAGE
           
            setTimeout(() => {
                submissionLoader.classList.add('hidden');
                successMessage1.classList.remove('hidden');
                form.reset(); // Reset form fields
                
                // Optional: Scroll to the success message
                successMessage1.scrollIntoView({ behavior: 'smooth', block: 'center' }); 

                // Optional: Hide success message and show form again after a few seconds
                setTimeout(() => {
                    successMessage1.classList.add('hidden');
                    quoteForm1.classList.remove('hidden');
                }, 5000); // 5 seconds
                
            }, 1000); // Show loader for at least 1 second
        } else {
            throw new Error(`Server returned status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
        
        // 3. ERROR: HIDE LOADER, SHOW FORM, ALERT USER
        submissionLoader.classList.add('hidden');
        quoteForm1.classList.remove('hidden');

        alert('There was an error submitting your quote. Please try again or contact us directly.');
    });
});
  
 const playSound = () => {
    // 1. Create the Audio object inside the handler
    const audio = new Audio("noti.mp3"); 
    
    // 2. Call play()
    audio.play()
        .catch(error => {
            // This is good practice to catch errors if playback is still blocked
            console.error("Audio playback failed:", error); 
        });
};


// Example: Attach to a specific button (e.g., your submit button)
document.getElementById('submitb').addEventListener('click', playSound);
});