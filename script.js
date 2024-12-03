document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '46fb6fecb0ee4274bd95cb04e8034169'; // Replace with your NewsAPI key

    function fetchNews(category) {
        const apiUrl = `https://newsapi.org/v2/everything?q=${category}&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const newsContainer = document.getElementById('news-container');
                newsContainer.innerHTML = ''; // Clear previous news
                if (data.articles && data.articles.length > 0) {
                    data.articles.forEach((article, index) => {
                        const articleElement = document.createElement('div');
                        articleElement.classList.add('news-article');

                        // Format the publication date
                        const publishedDate = new Date(article.publishedAt).toLocaleString();

                        articleElement.innerHTML = `
                            <img src="${article.urlToImage}" alt="News Image" loading="lazy">
                            <h3>${article.title}</h3>
                            <p>${article.description}</p>
                            <p><strong>Published on:</strong> ${publishedDate}</p>
                            <a href="${article.url}" target="_blank">Read more</a>
                        `;
                        if (index % 2 === 0) {
                            setTimeout(() => newsContainer.appendChild(articleElement), 1000 * (index / 2));
                        } else {
                            newsContainer.appendChild(articleElement);
                        }
                    });
                } else {
                    document.getElementById('error-message').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                document.getElementById('error-message').style.display = 'block';
            });
    }

    // Initial fetch for Home section
    fetchNews('general');

    // Smooth scrolling and news fetching for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            fetchNews(category);

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    });

    // Periodically update every second news article
    setInterval(() => {
        const activeCategory = document.querySelector('nav ul li a.active').getAttribute('data-category');
        fetchNews(activeCategory);
    }, 10000); // Update every 10 seconds (adjust as needed)
});
