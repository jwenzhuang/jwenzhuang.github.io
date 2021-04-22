//markdown library
const md = window.markdownit({html: true, typographer: true});

//click handlers
$("#container").on('click', '.index-item', function(e){
    let id = $(this).attr('id');
    resetContent();
    $(this).addClass('selected-index-item');
    $(`#${id}-content`).show();
    $('#content').scrollTop(0);
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

//get index and all files
function init(){
    $.ajax({
        url: `content/index.md`,
        datatype: "html"
    }).done(function(markdown){
        document.getElementById('index-body').innerHTML = md.render(markdown);
        let indexBody = document.getElementById('index-body');
        let h3Nodes = document.querySelectorAll('#index-body h3');
        for(let h3 of h3Nodes) {
            let contentID = h3.textContent;
            let indexItemHeader = h3.previousElementSibling;
            let indexItemBlurb = h3.nextElementSibling;
            let div = document.createElement('div');
            div.setAttribute('id', contentID);
            div.setAttribute('class', 'index-item');
            div.append(indexItemHeader);
            div.append(indexItemBlurb);
            indexBody.append(div);

            getContent(contentID, 'content');
        }
        getContent('about', 'index-body');
        getContent('default', 'content');
    });
}

//init
init();
