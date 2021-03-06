//markdown library
const md = window.markdownit({html: true});

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
    console.log($('#about-content'));
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

        let h3Nodes = document.querySelectorAll('#index-body h3');
        for(let h3 of h3Nodes) {
            let contentID = h3.textContent;
            let indexItemHeader = h3.previousElementSibling;
            indexItemHeader.setAttribute('id', contentID);
            indexItemHeader.setAttribute('class', 'index-item');

            getContent(contentID, 'content');
        }
        getContent('about', 'index-body');
        getContent('default', 'content');
    });
}

//init
init();
