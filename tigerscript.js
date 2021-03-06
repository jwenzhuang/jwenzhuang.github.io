const md = window.markdownit({html: true});

getIndex();
getAbout();
getDefault();

$(document).ready(function() {

    $("#container").on('click', '.index-item', function(e){
        let id = $(this).attr('id');
        resetContent();
        $(this).addClass('selected-index-item');
        $(`#${id}-content`).show();
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
});

function resetContent(){
    $('.content-item').hide();
    $('#index-body').children().removeClass('selected-index-item');
    $('#content').scrollTop(0);
}

function getIndex(){
    $.ajax({
        url: `content/index.md`,
        datatype: "html",
        success: function(markdown){
            let html = md.render(markdown);
            $('#index-body').html(html);
        
            let h3tags = $('#index-body').children('h3').get();
            for(let tag of h3tags) {
                let text = $(tag).text()
                $(tag).prev().attr('id', text).addClass('index-item');
                getContent(text);
            }
        }
    });
}

function getAbout(){
    $.ajax({
        url: `content/about.md`,
        datatype: "html",
        success: function(markdown) {
            let page = $('<div></div>').attr('id', `about-content`).addClass("content-item");
            let html = md.render(markdown);
        
            page.html(html);
            $('#index-body').append(page);
        }
    });
}

function getDefault(){
    $.ajax({
        url: `content/default.md`,
        datatype: "html",
        success: function(markdown) {
            let page = $('<div></div>').attr('id', `default-content`).addClass("content-item");
            let html = md.render(markdown);
        
            page.html(html);
            $('#content').append(page);
            $(`#default-content`).show();
        }
    });
}

function getContent(pageID){
    $.ajax({
        url: `content/${pageID}.md`,
        datatype: "html",
        success: function(markdown) {
            let page = $('<div></div>').attr('id', `${pageID}-content`).addClass("content-item");
            let html = md.render(markdown);
        
            page.html(html);
            $('#content').append(page);
        }
    });
}