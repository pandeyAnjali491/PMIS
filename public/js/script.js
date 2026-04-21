  const slides = document.querySelectorAll("#slideshow-container > div");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const dotsContainer = document.getElementById("slide-dots");

  let currentIndex = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "w-3 h-3 rounded-full bg-gray-400";
    if (i === 0) dot.classList.add("bg-blue-600");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    const offset = -currentIndex * 100;
    document.getElementById("slideshow-container").style.transform =
      `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.className = "w-3 h-3 rounded-full bg-gray-400";
      if (i === currentIndex) dot.classList.add("bg-blue-600");
    });
  }

  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));

  // Initial setup
  document.getElementById("slideshow-container").style.transition =
    "transform 0.5s ease-in-out";
  showSlide(0);
