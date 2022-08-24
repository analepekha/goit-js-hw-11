import axios from "axios";
import { renderGallery } from "../index";
import { Notify } from "notiflix";

export class PixabayAPI {
    BASE_URL = 'https://pixabay.com/api/';
    API_KEY = '29209484-44868bd05dae07d1026b865bf';

    searchParams = new URLSearchParams({
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
    })

    constructor() {
        this.searchQuery = ''
        this.page = 1;
        this.per_page = 40;
    }

    async getImages() {
        const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&${this.searchParams}&page=${this.page}&per_page=${this.per_page}`
        try {
            const response = await axios.get(url);
            const render = renderGallery(response.data.hits);
            console.log(response.data);
            this.page += 1;
            return response.data;
        } catch (error) {
            console.log(error.message); 
            Notify.warning(`We're sorry, but you've reached the end of search results.`);
            return;
        } 
    }

     startPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery=newQuery
    }
}





//DRAFTS

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '29209484-44868bd05dae07d1026b865bf'

// const searchParams = {
//     key: API_KEY,
//     q: '',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     per_page: 40,
//     page: 1,
// }

// async function getImages() {
//     const url = `${BASE_URL}?key=${searchParams.key}&q=${searchParams.q}&image_type=${searchParams.image_type}&orientation=${searchParams.orientation}&safesearch=${searchParams.safesearch}&per_page=${searchParams.per_page}&page=${searchParams.page},`;
//     try {
//         const response = await axios.get(url)
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// export { searchParams, getImages};