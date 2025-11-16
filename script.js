// Элементы для редактирования профиля
const pencilIcon = document.querySelector('.pencil');
const modal = document.getElementById('editModal');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const editForm = document.getElementById('editForm');

// Текущие данные профиля
const currentData = {
    name: 'Константин Константинопольский',
    study: 'хихигс',
    age: '20 лет',
    hobbies: 'Программирование, игры, книги и дркгая залупень'
};

// Функции для модального окна профиля
function openModal() {
    document.getElementById('editName').value = currentData.name;
    document.getElementById('editStudy').value = currentData.study;
    document.getElementById('editAge').value = currentData.age;
    document.getElementById('editHobbies').value = currentData.hobbies;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function saveData(newData) {
    document.querySelector('.name p').textContent = newData.name;
    document.querySelector('.person_info__text_container:nth-child(1) p:last-child').textContent = newData.study;
    document.querySelector('.person_info__text_container:nth-child(2) p:last-child').textContent = newData.age;
    document.querySelector('.person_info__text_container:nth-child(3) p:last-child').textContent = newData.hobbies;

    localStorage.setItem('userData', JSON.stringify(newData));
    Object.assign(currentData, newData);
}

// Обработчики для модального окна профиля
pencilIcon.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);

modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        closeModalFunc();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalFunc();
    }
});

editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const newData = {
        name: formData.get('name'),
        study: formData.get('study'),
        age: formData.get('age'),
        hobbies: formData.get('hobbies')
    };

    if (!newData.name.trim()) {
        alert('Пожалуйста, введите имя и фамилию');
        return;
    }

    saveData(newData);
    closeModalFunc();
});

// Элементы для постов
const postForm = document.getElementById('postForm');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');
const submitPost = document.getElementById('submitPost');
const titleError = document.getElementById('titleError');
const contentError = document.getElementById('contentError');
const myPostsContainer = document.querySelector('.my_posts');

// Данные постов
let posts = [];

// Картинки для постов
const postImages = [
    'pics/pics/post1.jpeg',
    'pics/post2.jpeg',
    'pics/post3.jpeg',
    'pics/post4.jpg'
];


function validateTitle(title) {
    if (!title.trim()) {
        return 'Название поста обязательно для заполнения';
    }
    if (title.length < 5) {
        return 'Название должно содержать минимум 5 символов';
    }
    if (title.length > 100) {
        return 'Название не должно превышать 100 символов';
    }
    return '';
}

function validateContent(content) {
    if (!content.trim()) {
        return 'Содержание поста обязательно для заполнения';
    }
    if (content.length < 10) {
        return 'Пост должен содержать минимум 10 символов';
    }
    if (content.length > 1000) {
        return 'Пост не должен превышать 1000 символов';
    }
    return '';
}


function showError(inputElement, errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    inputElement.parentElement.classList.add('error');
}

function hideError(inputElement, errorElement) {
    errorElement.classList.remove('show');
    inputElement.parentElement.classList.remove('error');
}


function addPost(title, content) {
    const postData = {
        id: 'post_' + Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        image: postImages[Math.floor(Math.random() * postImages.length)]
    };

    posts.unshift(postData);
    savePostsToStorage();
    renderPosts();
    clearForm();
}

function deletePost(postId) {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
        posts = posts.filter(post => post.id !== postId);
        savePostsToStorage();
        renderPosts();
    }
}

function savePostsToStorage() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function loadPostsFromStorage() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
        renderPosts();
    }
}

function renderPosts() {
    myPostsContainer.innerHTML = '';

    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'frame_1';
        postElement.id = post.id;

        const postImage = post.image || postImages[index % postImages.length];

        postElement.innerHTML = `
            <div class="polovinka" style="background-image: url(${postImage})"></div>
            <div class="content_1">
                <p class="date">${post.date}</p>
                <div class="vopros_postavlen">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                </div>
                <button class="delete-post" onclick="deletePost('${post.id}')">Удалить</button>
            </div>
        `;
        myPostsContainer.appendChild(postElement);
    });

    if (posts.length === 0) {
        myPostsContainer.innerHTML = `
            <div class="no-posts">
                <p>Пока нет постов. Создайте первый!</p>
            </div>
        `;
    }
}

function clearForm() {
    postTitle.value = '';
    postContent.value = '';
    hideError(postTitle, titleError);
    hideError(postContent, contentError);
}


submitPost.addEventListener('click', function (e) {
    e.preventDefault();

    const title = postTitle.value;
    const content = postContent.value;

    const titleValidation = validateTitle(title);
    const contentValidation = validateContent(content);

    if (titleValidation) {
        showError(postTitle, titleError, titleValidation);
    } else {
        hideError(postTitle, titleError);
    }

    if (contentValidation) {
        showError(postContent, contentError, contentValidation);
    } else {
        hideError(postContent, contentError);
    }

    if (!titleValidation && !contentValidation) {
        addPost(title, content);
    }
});

postTitle.addEventListener('input', function () {
    const validation = validateTitle(this.value);
    if (validation) {
        showError(this, titleError, validation);
    } else {
        hideError(this, titleError);
    }
});

postContent.addEventListener('input', function () {
    const validation = validateContent(this.value);
    if (validation) {
        showError(this, contentError, validation);
    } else {
        hideError(this, contentError);
    }
});


document.addEventListener('DOMContentLoaded', function () {

    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        saveData(parsedData);
    }


    loadPostsFromStorage();


    if (posts.length === 0) {
        posts = [
            {
                id: 'post_1',
                title: 'Кто же такие фиксики?',
                content: 'Ну вообще сам по себе поставлен уже неправильно, однако мы постараемся сделать так, чтобы этот вопрос перестал вызывать неправильные вопросы. Нихуя не поняли? так и надо)',
                date: '16 октября 2025',
                image: 'pics/post1.jpeg'
            },
            {
                id: 'post_2',
                title: 'dats my purse idk u',
                content: 'My name is Bobby. I like to party. And if u dont believe me watch me shake my body',
                date: '17 октября 2025',
                image: 'pics/post2.jpeg'
            }
        ];
        savePostsToStorage();
        renderPosts();
    }
});

window.deletePost = deletePost;