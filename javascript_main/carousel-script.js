//  const track = document.querySelector('.carousel-track');
//     const dots = document.querySelectorAll('.dot');
//     const prevBtn = document.querySelector('.carousel-btn.prev');
//     const nextBtn = document.querySelector('.carousel-btn.next');

//     let currentIndex = 0;
//     const totalSlides = 2;

//     function goToSlide(index) {
//         currentIndex = (index + totalSlides) % totalSlides;
//         track.style.transform = `translateX(-${currentIndex * 50}%)`;

//         dots.forEach(dot => dot.classList.remove('active'));
//         dots[currentIndex].classList.add('active');
//     }

//     prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
//     nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

//     dots.forEach(dot => {
//         dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
//     });

//     // Optional: auto-advance every 5 seconds
//     setInterval(() => goToSlide(currentIndex + 1), 5000);

const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide'); // matches your actual HTML class
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;
const totalSlides = slides.length; // now correctly reads 5

function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});

// Optional: auto-advance every 5 seconds
setInterval(() => goToSlide(currentIndex + 1), 5000);