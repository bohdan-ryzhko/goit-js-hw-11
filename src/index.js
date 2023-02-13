import NewsApiService from './js/news-services';
import refs from './js/refs';
import './css/styles.scss';

const newsApiService = new NewsApiService();

function submitOnSearchForm(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const searchQuery = form.elements.searchQuery.value;
	
	newsApiService.resetPage();
	newsApiService.query = searchQuery;
	newsApiService.getFetchResponse();
}

function loadMoreList() {
	newsApiService.page += 1;
	newsApiService.getFetchResponse();
}

refs.moreBtnElem.addEventListener('click', loadMoreList);
refs.formSearchEl.addEventListener('submit', submitOnSearchForm);
