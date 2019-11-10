function requestData(cb) {
    const request = new XMLHttpRequest();
    
    request.open('GET', 'https://api.nytimes.com/svc/topstories/v2/science.json?api-key=Gwxln5M3geWlhR6UE0TY1FUWKSG3wCil');
    
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            const res = JSON.parse(this.response);
            results = res.results;
            return cb();
        } else {
            console.error(this);
        }
    };
    
    request.onerror = function() {
        console.error(this);
    };
    
    request.send();
}

function initForm() {
    const form = document.querySelector('#search-form');
    const input = document.querySelector('input[name="search"]');
    
    // Listen for form submit (catches enter keypress or btn click)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get the article data
        requestData(() => {
            searchData(input.value);
        });
    });
}

function searchData(input) {
    const searchTerms = input.toLowerCase().split(' ');
    // Empty matches
    matches = [];
    results.forEach((item, itemIndex) => {
        let bylines = item.byline.split(' ');
        // Remove by/and and just check against the actual names
        bylines.forEach((byline, index) => {
            if (byline === 'by' || byline === 'and') {
                bylines.splice(index, 1);
            }
        });
        bylines = bylines.join(' ');
        words = item.title.toLowerCase() + ' ' + item.section.toLowerCase() + ' ' + bylines.toLowerCase();
        words = words.split(' ');
        words.forEach(word => {
            searchTerms.forEach((term) => {
                if (word === term && !matches.includes(item)) matches.push(item);
            });
        });
    });
    displayResults();
}

function displayResults() {
    const resultsContainer = document.querySelector('.results-container');
    const noResults = document.querySelector('.no-results');
    // Clear any previous results
    resultsContainer.innerHTML = '';
    // If no matches, show the no matches message
    if (matches.length < 1)  {
        noResults.style.display = 'inline-block';
        resultsContainer.style.display = 'none';
    } else {
        resultsContainer.style.display = 'inline-block';
        noResults.style.display = 'none';
    }
    matches.forEach(match => {
        const articleLink = document.createElement('A');
        articleLink.setAttribute('href', match.short_url);
        articleLink.setAttribute('target', '_blank');
        articleLink.innerHTML = `${match.title} ${match.byline} (${match.section})`;
        resultsContainer.appendChild(articleLink);
    });
}
