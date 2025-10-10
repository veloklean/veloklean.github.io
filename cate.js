document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const navBar = document.getElementById('navbar');
    const controls = document.getElementById('navigation-controls');
    const backButton = document.getElementById('back-button');
    
    const stepCategories = document.getElementById('step-categories');
    const stepSubservices = document.getElementById('step-subservices');
    const stepPackages = document.getElementById('step-packages');
    
    // Modal Elements
    const quoteModal = document.getElementById('quote-modal');
    const closeButton = document.querySelector('.close-button');
    const openQuoteButtons = document.querySelectorAll('.open-quote-modal');
    const selectedServiceInput = document.getElementById('selected-service-input');

    let currentView = 'categories';
    let selectedCategory = null;
    let selectedSubservice = null;

    // --- Data Structure for Services (UPDATED: Added 'hours') ---
    const serviceData = {
        house: {
            title: "House Cleaning Services",
            subservices: [
                {
                    title: "Standard Cleaning",
                    icon: "fas fa-broom",
                    desc: "Regular upkeep for a consistently tidy home.",
                    packages: [
                        // Package structure: { size, original, discounted, discount, hours }
                        { size: "1 Bedroom", original: 180, discounted: 130, discount: "28%", hours: "2.5 hrs" },
                        { size: "2 Bedroom", original: 200, discounted: 150, discount: "25%", hours: "3 hrs" },
                        { size: "3 Bedroom", original: 250, discounted: 200, discount: "20%", hours: "4 hrs" },
                        { size: "4+ Bedroom", original: 300, discounted: 250, discount: "17%", hours: "5 hrs" }
                    ]
                },
                {
                    title: "Deep Cleaning",
                    icon: "fas fa-hand-sparkles",
                    desc: "Intensive service for a truly immaculate space, top to bottom.",
                    packages: [
                         { size: "Studio", original: 220, discounted: 180, discount: "18%", hours: "3 hrs" },
                        { size: "Small Home", original: 350, discounted: 290, discount: "17%", hours: "4.5 hrs" },
                        { size: "Large Home", original: 500, discounted: 410, discount: "18%", hours: "6 hrs" }
                    ]
                }
            ]
        },
        commercial: {
            title: "Commercial & Office Cleaning",
            subservices: [
                {
                    title: "Office Standard",
                    icon: "fas fa-laptop-house",
                    desc: "Daily/weekly cleaning for general office spaces.",
                    packages: [
                         { size: "Small Office", original: 400, discounted: 320, discount: "20%", hours: "3-4 hrs" },
                        { size: "Mid-size Floor", original: 700, discounted: 580, discount: "17%", hours: "5-6 hrs" },
                        { size: "Full Building", original: 1200, discounted: 950, discount: "21%", hours: "8+ hrs" }
                    ]
                }
            ]
        },
        // Placeholder data for other categories
        carpet: { title: "Carpet & Upholstery Cleaning", subservices: [{ title: "Steam Cleaning", icon: "fas fa-couch", desc: "Advanced stain removal.", packages: [{ size: "Per Area (Avg.)", original: 150, discounted: 100, discount: "33%", hours: "1.5 hrs" }] }] },
        move: { title: "Move In / Move Out Cleaning", subservices: [{ title: "Full Transition Clean", icon: "fas fa-box-open", desc: "Top-to-bottom clean for seamless transitions.", packages: [{ size: "Per Sq. Ft.", original: 450, discounted: 380, discount: "15%", hours: "5-7 hrs" }] }] },
        'post-construction': { title: "Post Construction Cleaning", subservices: [{ title: "Dust & Debris Removal", icon: "fas fa-hard-hat", desc: "Detailed post-build clean up.", packages: [{ size: "Custom Quote", original: 0, discounted: 0, discount: "0%", hours: "Varies" }] }] },
        retail: { title: "Restaurant & Retail Cleaning", subservices: [{ title: "Nightly Sanitization", icon: "fas fa-utensils", desc: "Specialized hygiene protocols.", packages: [{ size: "Nightly Service", original: 600, discounted: 490, discount: "18%", hours: "3-5 hrs" }] }] },
    };

    // --- Core Navigation Logic (Unchanged) ---
    const navigateTo = (nextView, direction = 'forward') => {
        // ... (Navigation logic remains the same)
        const views = { categories: stepCategories, subservices: stepSubservices, packages: stepPackages };
        const currentElement = views[currentView];
        const nextElement = views[nextView];

        if (!nextElement) return;

        if (currentElement) {
            currentElement.classList.remove('active-view');
            currentElement.classList.add(direction === 'forward' ? 'slide-out' : 'slide-in');
        }

        if (nextView === 'categories') {
            controls.classList.add('hidden');
        } else {
            controls.classList.remove('hidden');
        }

        nextElement.classList.remove('slide-out', 'slide-in');
        nextElement.classList.add(direction === 'back' ? 'slide-out' : 'slide-in');

        currentView = nextView;

        setTimeout(() => {
            if (currentElement) {
                currentElement.style.display = 'none';
                currentElement.classList.remove('slide-out', 'slide-in');
            }
            
            nextElement.style.display = 'block';
            nextElement.classList.remove('slide-out', 'slide-in');

            setTimeout(() => {
                nextElement.classList.add('active-view');
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);

        }, 500);
    };

    // --- Event Listeners (Mostly Unchanged) ---

    // 1. Main Category Cards Listener
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const targetCard = e.currentTarget.closest('.service-card');
            selectedCategory = targetCard.dataset.category;
            
            if (serviceData[selectedCategory]) {
                renderSubservices(serviceData[selectedCategory]);
                navigateTo('subservices', 'forward');
            }
        });
    });

    // 2. Back Button Listener
    backButton.addEventListener('click', () => {
        if (currentView === 'packages') {
            const data = serviceData[selectedCategory];
            renderSubservices(data);
            navigateTo('subservices', 'back');
        } else if (currentView === 'subservices') {
            selectedCategory = null;
            navigateTo('categories', 'back');
        }
    });

    // 3. Subservice Card Listener
    stepSubservices.addEventListener('click', (e) => {
        const subCard = e.target.closest('.subservice-card');
        if (subCard) {
            const subTitle = subCard.dataset.subservice;
            const subData = serviceData[selectedCategory].subservices.find(s => s.title === subTitle);

            if (subData) {
                selectedSubservice = subData;
                renderPackages(subData);
                navigateTo('packages', 'forward');
            }
        }
    });
    
    // 4. Quote Modal Handlers (Unchanged)
    openQuoteButtons.forEach(button => {
        button.addEventListener('click', () => {
            let serviceName = "General Inquiry";
            if (selectedCategory && selectedSubservice) {
                serviceName = `${selectedCategory.toUpperCase()}: ${selectedSubservice.title}`;
            }
            selectedServiceInput.value = serviceName;
            
            quoteModal.classList.remove('hidden');
        });
    });

    closeButton.addEventListener('click', () => { quoteModal.classList.add('hidden'); });
    window.addEventListener('click', (e) => { if (e.target === quoteModal) { quoteModal.classList.add('hidden'); } });
    
    // Sticky Navbar Glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navBar.classList.add('navbar-scrolled');
        } else {
            navBar.classList.remove('navbar-scrolled');
        }
    });
    
    // --- Dynamic Rendering Functions ---

    /** Renders the subservice cards for the selected main category. (Unchanged) */
    function renderSubservices(categoryData) {
        stepSubservices.innerHTML = `<h2>${categoryData.title}</h2><div class="subservice-grid"></div>`;
        const grid = stepSubservices.querySelector('.subservice-grid');

        categoryData.subservices.forEach((sub, index) => {
            const card = document.createElement('div');
            card.className = 'subservice-card';
            card.dataset.subservice = sub.title;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', `${100 * index}`);
            
            card.innerHTML = `
                <i class="${sub.icon}"></i>
                <h3>${sub.title}</h3>
                <p>${sub.desc}</p>
                <button class="btn-packages">View Prices</button>
            `;
            grid.appendChild(card);
        });
        AOS.refresh();
    }

    /** Renders the pricing packages for the selected subservice. (UPDATED: Added hours display) */
    function renderPackages(subserviceData) {
        stepPackages.innerHTML = `<h2>Pricing: ${subserviceData.title}</h2><div class="package-grid"></div>`;
        const grid = stepPackages.querySelector('.package-grid');
        
        subserviceData.packages.forEach((pkg, index) => {
            const isCustomQuote = pkg.discounted === 0;
            const priceHtml = isCustomQuote ? 
                `<span class="discounted-price">Quote</span>` :
                `<span class="original-price">$${pkg.original}</span>
                 <span class="discounted-price">$${pkg.discounted}</span>`;
            
            const badgeHtml = isCustomQuote ? 
                `<div class="discount-badge custom-badge">Custom</div>` :
                `<div class="discount-badge">-${pkg.discount}</div>`;

            const hoursDisplay = pkg.hours === "Varies" ? 
                `<span class="hours-estimate">Hours: ${pkg.hours}</span>` :
                `<span class="hours-estimate"><i class="far fa-clock"></i> Est. ${pkg.hours}</span>`;

            const buttonText = isCustomQuote ? "Request Custom Quote" : "Select Options";

            const card = document.createElement('div');
            card.className = 'package-card';
            card.setAttribute('data-aos', 'zoom-in');
            card.setAttribute('data-aos-delay', `${50 * index}`);

            card.innerHTML = `
                ${badgeHtml}
                <div class="package-header">
                    <h4>${pkg.size} Package</h4>
                </div>
                <div class="pricing">
                    ${priceHtml}
                </div>
                <div class="hourly-details">
                    ${hoursDisplay}
                    <p>Perfect for a ${pkg.size.toLowerCase()} space.</p>
                </div>
                <button class="cta-button primary-cta open-quote-modal">${buttonText}</button>
            `;
            grid.appendChild(card);
        });
        AOS.refresh();
    }



    //submission 

     // --- NEW: Form Submission & Modal Elements ---
    const modalForm = document.getElementById('modal-quote-form');
    const modalLoader = document.getElementById('modal-submission-loader');
    const modalSuccess = document.getElementById('modal-success-message');
    const formSubtitle = document.getElementById('form-subtitle');
    
    // Replace this with your actual Google Sheet URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwAwGiic_8dhOXALIfguhUMI06O7dqJABiiFJHyF-exNcRudSt7r6iJIiEYmpHPka3t/exec'; 

    // --- NEW: Audio Function ---
    const playSound = () => {
        // Ensure the path to your audio file is correct
        const audio = new Audio("noti.mp3"); 
        audio.play()
             .catch(error => {
                 // Fails silently if the browser blocks autoplay
                 console.warn("Audio playback blocked by browser.", error); 
             });
    };

    // --- NEW: Form Submission Listener ---
    if (modalForm) {
        modalForm.addEventListener('submit', e => {
            e.preventDefault();

            // 1. START: Hide form content and show loader
            modalForm.classList.add('hidden');
            formSubtitle.classList.add('hidden');
            modalSuccess.classList.add('hidden');
            modalLoader.classList.remove('hidden');

            // 2. SUBMIT DATA
            fetch(scriptURL, { method: 'POST', body: new FormData(modalForm) })
                .then(response => {
                    if (response.ok) {
                        // 3. SUCCESS: Hide loader, show success message, play sound
                        modalLoader.classList.add('hidden');
                        modalSuccess.classList.remove('hidden');
                        
                        // Play the sound on successful, user-initiated submission
                        playSound();

                        // Optional: Hide modal/success after a delay
                        setTimeout(() => {
                             quoteModal.classList.add('hidden');
                             // Reset the modal content for next use
                             modalSuccess.classList.add('hidden');
                             modalForm.classList.remove('hidden');
                             formSubtitle.classList.remove('hidden');
                             modalForm.reset();
                        }, 5000); 
                    } else {
                        throw new Error(`Server returned status: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error('Error submitting form!', error.message);
                    
                    // 4. ERROR: Hide loader, show form again, alert user
                    modalLoader.classList.add('hidden');
                    modalForm.classList.remove('hidden');
                    formSubtitle.classList.remove('hidden');
                    alert('An error occurred. Please try again or contact us directly.');
                });
        });
    }



    
});