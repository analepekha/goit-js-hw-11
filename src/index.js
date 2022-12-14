import './css/styles.css';
import { throttle } from 'throttle-debounce';
import { PixabayAPI } from './js/pixabay.API';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightboxGallery = new SimpleLightbox('.gallery a');
const pixabayAPI = new PixabayAPI()

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
}

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    // проверяем что достигли последнего элемента
    if (entry.isIntersecting) {
      // перестаем его отслеживать
      observer.unobserve(entry.target);
      // и загружаем новую порцию контента
      pixabayAPI.getImages();
    }
  },
  { threshold: 0.5 }
);

refs.form.addEventListener('submit', searchQuery);

async function searchQuery(e) {
  e.preventDefault();
  pixabayAPI.query = refs.input.value.trim()
  pixabayAPI.startPage();
  refs.gallery.innerHTML = ''

    try {
        if (!pixabayAPI.query) {
            Notify.failure('Sorry, enter the query')
            return;
      };
        const response = await pixabayAPI.getImages()

        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
      };
        if (response.totalHits) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            renderGallery(response.hits);

            const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
                window.scrollBy({
                  top: cardHeight * -100,
                  behavior: 'smooth',
                })
            return;
      };
    } catch (error) {
        console.log(error);
    }
}

export function renderGallery(cards) {
  const markup =
    cards.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
                    <a class="photo-link" href="${largeImageURL}">  
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
                    <div class="info">
                      <p class="info-item">
                        <b>Likes</b> ${likes}
                      </p>
                      <p class="info-item">
                        <b>Views</b> ${views}
                      </p>
                      <p class="info-item">
                        <b>Comments</b> ${comments}
                      </p>
                      <p class="info-item">
                        <b>Downloads</b> ${downloads}
                      </p>
                    </div>
                </div>`
        }).join('')
  refs.gallery.insertAdjacentHTML('beforeend', markup)
  lightboxGallery.refresh();

  const lastCard = document.querySelector(".photo-card:last-child");
      if (lastCard) {
        infiniteObserver.observe(lastCard);
      }
  }




// FIRST OPTION WITH HEIGHT OF SCREEN

// import './css/styles.css';
// import { throttle } from 'throttle-debounce';
// import { PixabayAPI } from './js/pixabay.API';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { smoothScroll } from './js/smooth_scrolls'
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const lightboxGallery = new SimpleLightbox('.gallery a');
// const pixabayAPI = new PixabayAPI()

// const refs = {
//     form: document.querySelector('#search-form'),
//     input: document.querySelector('input'),
//     gallery: document.querySelector('.gallery'),
// }

// refs.form.addEventListener('submit', searchQuery);

// async function searchQuery(e) {
//     e.preventDefault();
//     refs.gallery.innerHTML = '';
//     pixabayAPI.query = refs.input.value.trim()
//     pixabayAPI.startPage();

//     try {
//         if (!pixabayAPI.query) {
//             refs.gallery.innerHTML = ''
//             Notify.failure('Sorry, enter the query')
//           return;
//         }
//         const response = await pixabayAPI.getImages()

//         if (response.totalHits === 0) {
//             Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//             return;
//         } else {
//             Notify.success(`Hooray! We found ${response.totalHits} images.`)
//             renderGallery(response.hits)
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

// function renderGallery(images) {
//     const markup = images
//         .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//             return `<div class="photo-card">
//                     <a class="photo-link" href="${largeImageURL}">  
//                     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//                     </a>
//                     <div class="info">
//                       <p class="info-item">
//                         <b>Likes</b> ${likes}
//                       </p>
//                       <p class="info-item">
//                         <b>Views</b> ${views}
//                       </p>
//                       <p class="info-item">
//                         <b>Comments</b> ${comments}
//                       </p>
//                       <p class="info-item">
//                         <b>Downloads</b> ${downloads}
//                       </p>
//                     </div>
//                 </div>`
//         }).join('')
//   refs.gallery.insertAdjacentHTML('beforeend', markup)
//   lightboxGallery.refresh()
// }

// window.addEventListener('scroll', throttle(200, infiniteScroll));

// async function infiniteScroll() {
//   const documentRect = document.documentElement.getBoundingClientRect();

//   if (documentRect.bottom < document.documentElement.clientHeight + 100) {
//     try {
//       const response = await pixabayAPI.getImages();
//       renderGallery(response.hits);
//       smoothScroll();
//     } catch (error) {
//       Notify.info('We are sorry, but you have reached the end of search results.');
//       return;
//     }
//   }
// }











