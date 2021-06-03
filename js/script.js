const $mainLeft = document.querySelector('.main-left');
const $addBtn = document.querySelector('.addBtn');
const $editMain = document.querySelector('.editMain');
const $editCloseBtn = document.querySelector('.editCloseBtn');
const $submitBtn = document.querySelector('.submitBtn');
const $inputTitle = document.querySelector('.inputTitle');
const $inputText = document.querySelector('.inputText');
const $inputAuthor = document.querySelector('.inputAuthor');
const $inputImage = document.querySelector('.inputImage');


function getRequest(id, method, body ,query, cb){
    const baseURL = `http://2.57.186.103:5000/api/posts/${id}?${query}`;
    const xhr = new XMLHttpRequest();
    xhr.open(method, baseURL);
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.response);
        cb(response);
    });
    if(method == 'POST' || method == 'PUT'){
        xhr.setRequestHeader('Content-type', 'application/json');
    };
    xhr.addEventListener('error', e => {
        console.error(e);
    });
    xhr.send(JSON.stringify(body));
}

window.addEventListener('load', () => {
    getRequest(
        '',
        'GET',
        null,
        'limit=20',
        cb => {
            if(cb?.length == 0){
                $mainLeft.innerHTML = `<p style="text-align: center">Empty!</p>`;
            }else{
                const temp = cb.data.reverse().map(item => cardTemplate(item)).join('');
                $mainLeft.innerHTML = temp
            }
        }
    )
})

function cardTemplate({title, body, date, author, _id, img}){
    return `
        <div class="card">
            <span title="delete" onclick="deleteBlog('${_id}')" class="deleteBtn fixedBtn">&times;</span>
            <span title="edit" onclick="editBlog('${_id}')" class="editBtn fixedBtn"><i class="fas fa-edit"></i></span>
            <span title="rotate" onclick="rotateBlog('${_id}')" class="rotateBtn fixedBtn"><i class="fas fa-sync-alt"></i></span>
            <span title="Watch pinned image" onclick="imageBlog('${img}')" class="imageBtn fixedBtn"><i class="fas fa-image"></i></span>
            <div class="card-header">
                <h4>${title}</h4>
            </div>
            <div class="card-body">
                <p>${body}</p>
            </div>
            <div class="card-footer">
                <div><p>${date}</p></div>
                <div class="authorBlock"><p>${author}</p></div>
            </div>
        </div>
    `
}

function imageBlog(img){
    document.body.insertAdjacentHTML('beforeend', 
    `
        <div class="imageMain">
            <div class="imageBlock">
                <article onclick="closeImage()">&times;</article>
                <span><a href="${img}">${img}</a></span>
                <div class="imageDiv"></div>
            </div>
        </div>
    `
    )

    const imageDiv = document.querySelector('.imageDiv');
    imageDiv.style.background = `url(${img}) center no-repeat`;
}

function closeImage(){
    const imageMain = document.querySelector('.imageMain');
    imageMain.remove();
}

function deleteBlog(id){
    const askDelete = confirm('Are u sure?');
    if(askDelete){
        getRequest(
            id,
            'DELETE', 
            null,
            '',
            cb => {
                console.log(cb);
                window.location.reload()
            }
        )
    }
}


function editBlog(id){
    const askEdit = confirm('Are u sure?');
    if(askEdit){
        getRequest(
            '',
            'PUT',
            {
                _id: id,
                title: prompt('New Title: '),
                body: prompt('New Text: '),
                author: prompt('New Author: '),
                img: prompt('New Image (url): '),
            },
            '',
            cb => {
                window.location.reload();
            }
        )
    }
}

$addBtn.addEventListener('click', e => {
    e.preventDefault();

    $editMain.classList.remove('displayNone');
})

$editCloseBtn.addEventListener('click', e => {
    e.preventDefault();

    $editMain.classList.add('displayNone');
})

$submitBtn.addEventListener('click', e => {
    e.preventDefault();

    if($inputText.value && $inputTitle.value && $inputAuthor.value && $inputImage.value){
        if($inputText.value.length > 250 || $inputTitle.value.length > 60){
            alert('Описание не должно превышать 250 символов! Название не должно превышать 60 символов!');
        }else{
            getRequest(
                '',
                'POST',
                {
                    title: $inputTitle.value,
                    body: $inputText.value,
                    author: $inputAuthor.value,
                    img: $inputImage.value,
                    date: new Date()
                },
                '',
                cb => {
                    console.log(cb)
                    window.location.reload();
                }
            )
        }
    }else{
        alert('Не все поля заполнены!')
    }
})