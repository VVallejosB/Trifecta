let menu = document.querySelector('#menu-icon')
let navlist = document.querySelector('.navlist')

menu.onclick=() =>{
  menu.classList.toggle('bx-x');
  navlist.classList.toggle('open')
}
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');
const totalImages = images.length;

// Mover a la siguiente imagen
document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateCarousel();
});

// Mover a la imagen anterior
document.querySelector('.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  updateCarousel();
});

// Mover a la imagen seleccionada por el indicador
function currentSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Actualizar la posición del carrusel y los indicadores
function updateCarousel() {
  const carouselImages = document.querySelector('.carousel-images');
  carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Actualizar indicadores
  const indicators = document.querySelectorAll('.indicators button');
  indicators.forEach((indicator, index) => {
    if (index === currentIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Avanzar automáticamente cada 5 segundos
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateCarousel();
}, 5000);
const fulImgBox = document.getElementById("fulImgBox"),
fulImg = document.getElementById("fulImg");

function openFulImg(reference){
    fulImgBox.style.display = "flex";
    fulImg.src = reference
}
function closeImg(){
    fulImgBox.style.display = "none";
}
