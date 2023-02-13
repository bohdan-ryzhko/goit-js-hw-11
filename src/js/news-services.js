import axios from "axios";
import { Notify } from "notiflix";
import refs from "./refs";
import SimpleLightbox from "simplelightbox";

class NewsApiService {
	constructor() {
		this.searchQuery = "";
		this.totalHits = 0;
		this.page = 1;
		this.baseUrl = "https://pixabay.com/api/?key=33587663-9f49167c56a6d2d024abb7fb5";
		this.imageType = "image_type=photo";
		this.orientation = "orientation=horizontal";
		this.safesearch = "safesearch=true";
		this.perPage = "per_page=40";
	}
	
	getFetchResponse() {
		const url = `${this.baseUrl}&q=${this.searchQuery}&${this.imageType}&${this.orientation}&${this.safesearch}&${this.perPage}&page=${this.page}`;
		this.getResponse(url);
	}

	getResponse(url) {
		return axios.get(url)
			.then(({ data: { hits, totalHits } }) => {
				if (hits.length === 0) {
					throw new Error();
				}

				if (refs.moreBtnElem.classList.contains('is-hidden')) {
					refs.moreBtnElem.classList.remove('is-hidden');
				}

				this.totalHits = totalHits;
				if (this.page === 1) {
					refs.contentListEl.innerHTML = '';
					Notify.success(`Hooray! We found ${this.totalHits} images.`);
				}
				console.log(this.page);
				refs.contentListEl.insertAdjacentHTML('beforeend', this.getMurkupContentList(hits));

				const lightbox = new SimpleLightbox('.gallery .photo-card .photo-card__link');
				const { height: cardHeight } = document
							.querySelector(".gallery")
							.firstElementChild.getBoundingClientRect();

					window.scrollBy({
						top: cardHeight * 2,
						behavior: "smooth",
					});
				function onContentList(event) {
					event.preventDefault();
					const target = event.target;
					if (target.nodeName !== "IMG") {
						return;
					}
					lightbox;
				}
				refs.contentListEl.addEventListener('click', onContentList);
			})
			.catch((error) => {
				Notify.failure(`We're sorry, but you've reached the end of search results.`);
				console.log(error);
			});
	}

	loadMore() {
		this.page += 1;
		const url = `${this.baseUrl}&q=${this.searchQuery}&${this.imageType}&${this.orientation}&${this.safesearch}&${this.perPage}&page=${this.page}`;
		this.getResponse(url);
	}

	get query() {
		return this.searchQuery;
	}

	set query(newQuery) {
		this.searchQuery = newQuery;
	}

	resetPage() {
		this.page = 1;
	}

	getMurkupContentList(list) {
		return list.map(({ likes, comments, downloads, views, webformatURL, largeImageURL, tags }) => {
			return `
			<div class="photo-card">
					<a class="photo-card__link" href="${largeImageURL}">
						<img height="200" src="${webformatURL}" alt="${tags}" loading="lazy" />
						<div class="info">
							<p class="info-item">
								<b>Likes</b>
								<b class="info-item__value">${likes}</b>
							</p>
							<p class="info-item">
								<b>Views</b>
								<b class="info-item__value">${views}</b>
							</p>
							<p class="info-item">
								<b>Comments</b>
								<b class="info-item__value">${comments}</b>
							</p>
							<p class="info-item">
								<b>Downloads</b>
								<b class="info-item__value">${downloads}</b>
							</p>
						</div>
						</a>
						</div>
					`
		}).join('');
	}
}

export default NewsApiService;