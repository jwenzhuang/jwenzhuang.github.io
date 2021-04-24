//markdown library
const md = window.markdownit({html: true, typographer: true});

//click handlers
$("#container").on('click', '.index-item', function(e){
    let id = $(this).attr('id');
    resetContent();
    $(this).addClass('selected-index-item');
    $('#content').scrollTop(0);
    if($(`#${id}-content`).length === 0){
        getPost(id);
    } else {
        $(`#${id}-content`).show();
    }
});

$("#index-btn").click(function(e){
    resetContent();
    $('#index-body').children().not("h3").show();
    $('#about-content').hide();
    $(`#default-content`).show();
});

$("#about-btn").click(function(e){
    resetContent();
    $('#index-body').children().hide();
    $('#about-content').show();
    $(`#default-content`).show();
});

//clears content selection
function resetContent(){
    $('.content-item').hide();
    $('#index-body').children().removeClass('selected-index-item');
}

//get md files
function getContent(contentID, page){
    $.ajax({
        url: `content/${contentID}.md`,
        datatype: "html"
    }).done(function(markdown) {
        let div = document.createElement("div");
        div.setAttribute('id', `${contentID}-content`);
        if(page == 'content'){
            div.setAttribute('class', "content-item");
        }
        div.innerHTML = md.render(markdown);
        document.getElementById(page).append(div);

        if(contentID == 'default'){
            div.style.display = 'block';
        }
    });
}

//get json files (posts)
function getPost(contentID){
    $.ajax({
        url: `content/posts/${contentID}.json`,
        datatype: "json"
    }).done(function(obj) {
        let div = document.createElement("div");
        div.setAttribute('id', `${contentID}-content`);
        div.setAttribute('class', "content-item");

        if(obj.title){
            let title = document.createElement("h1");
            title.innerHTML = md.renderInline(obj.title);
            div.append(title);
        }

        let body = document.createElement("div");
        body.innerHTML = md.render(obj.body);
        div.append(body);
        $("#content").append(div);
        $(`#${contentID}-content`).show();
    });
}

//get index and all files
function init(){
    $.ajax({
        url: `content/index.json`,
        datatype: "json"
    }).done(function(index_object){
        let indexBody = document.getElementById('index-body');
        for(let post of index_object.posts) {
            let contentID = post.post_id;
            let div = document.createElement('div');
            div.setAttribute('id', contentID);
            div.setAttribute('class', 'index-item');

            let title = document.createElement('h1');
            title.innerHTML = md.renderInline(post.title);
            div.append(title);

            let summary = document.createElement('p');
            summary.innerHTML = md.renderInline(post.summary);
            div.append(summary);

            indexBody.append(div);
        }
        getContent('about', 'index-body');
        getContent('default', 'content');
    });
}

//init
init();
