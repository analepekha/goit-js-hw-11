import axios from "axios";
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
            console.log(response);
            this.page += 1;
            return response.data;
        } catch (error) {
            console.log(error.message); 
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
