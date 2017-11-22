let touch = require('./touch.js');

function empty() {return null;}
function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  xhr.send();
};
const swipeEndCallback = function(e, direction) {
  var current_tab = $('.protograph-app-tabs-container .protograph-app-tab.protograph-app-active-tab'),
    current_tab_count,
    current_tab_content = $('.protograph-app-active-tab-content');

  current_tab = $(current_tab);
  current_tab_count = +current_tab.attr('data-tab');

  switch(direction) {
    case 'left':
        if (current_tab_count < 2) {
          //switch tabs
          current_tab.removeClass('protograph-app-active-tab');
          current_tab_content.removeClass('protograph-app-active-tab-content');

          current_tab_count += 1;
          if (current_tab_count === 0) {
            $('.protograph-app-intro-holder').css('display', 'block');
          } else {
            $('.protograph-app-intro-holder').css('display', 'none');
          }

          current_tab = $(`.protograph-app-tab[data-tab="${current_tab_count}"]`);
          current_tab.addClass('protograph-app-active-tab');

          current_tab_content = $($('.protograph-app-3col-grid').children()[current_tab_count]);
          current_tab_content.addClass('protograph-app-active-tab-content');
        }
      break;
    case 'right':
      if (current_tab_count > 0) {
        //switch tabs
        current_tab.removeClass('protograph-app-active-tab');
        current_tab_content.removeClass('protograph-app-active-tab-content');

        current_tab_count -= 1;
        if (current_tab_count === 0) {
          $('.protograph-app-intro-holder').css('display', 'block');
        } else {
          $('.protograph-app-intro-holder').css('display', 'none');
        }

        current_tab = $(`.protograph-app-tab[data-tab="${current_tab_count}"]`);
        current_tab.addClass('protograph-app-active-tab');

        current_tab_content = $($('.protograph-app-3col-grid').children()[current_tab_count]);
        current_tab_content.addClass('protograph-app-active-tab-content');
      }
      break;
  }
  $('.protograph-app-swipe-left').css('display', 'none');
}

document.addEventListener("DOMContentLoaded", function(event) {

  let dimension = getScreenSize(), mode;
  var showChar;
  if (dimension.width <= 500){
    mode = 'mobile';
    showChar = 200
  } else {
    mode = 'laptop';
    showChar = 460;
  }
  // Configure/customize these variables.
  // var ellipsestext = "...";
  // var moretext = "पढ़ते रहिये";
  // var lesstext = "कम दिखाएं";

  // $('.project-description').each(function() {
  //   var content = $(this).html();

  //   if(content.length > showChar) {
  //     var c = content.substr(0, showChar);
  //     var h = content.substr(showChar, content.length - showChar);

  //     var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span><a href="" class="morelink">' + moretext + '</a></span>';

  //     $(this).html(html);
  //   }
  // });

  // $(".morelink").click(function(){
  //   if($(this).hasClass("less")) {
  //     $(this).removeClass("less");
  //     $(this).html(moretext);
  //   } else {
  //     $(this).addClass("less");
  //     $(this).html(lesstext);
  //   }
  //   $(this).parent().prev().toggle();
  //   $(this).prev().toggle();
  //   return false;
  // });


  if (mode === 'laptop'){
    // Code to animate the home screen.
    setTimeout(() => {
      $('.protograph-app-intro-holder').addClass('protograph-app-intro-holder-animate');
        setTimeout(() => {
          $('.protograph-app-3col-grid').css('display', 'block');
          $('.protograph-app-main-container').css('height', 'auto');
          $('.protograph-app-navbar').addClass('protograph-app-navbar-slide-in');
          setTimeout(() => {
              $('.protograph-app-3col-grid').addClass('protograph-app-3col-grid-slide-up');
              setTimeout(() => {
                $('.briefs-column').sticky({"widthFromWrapper": false});
                $('.filter-column').sticky();
                $('.about-advertisement').sticky();
              },750);
            },650);
        },650);
        getJSON('https://cdn.protograph.pykih.com/579747381e1f4a91c452f854/index.json', function (err, data){
          if (err != null) {
            alert('Something went wrong: ' + err);
          } else {
            data.map((d,i) => {
              let createDiv = document.createElement('div');
              createDiv.id = 'ProtoCard-article'+i
              createDiv.className= 'ProtoCard-article'
              document.getElementById('display-stories').appendChild(createDiv);
              new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, data[i].default_view);
            })
          }
        });
    }, 2000);
    // $('.briefs-column').sticky({topSpacing:62, bottomSpacing: 275});
    // $('.filter-column').sticky({topSpacing:62, bottomSpacing: 275});
    // $('.about-advertisement').sticky({topSpacing:62, bottomSpacing: 275});
  } else {
    $('.protograph-app-tabs-container').sticky({topSpacing:0, zIndex: 100});
    $('.mobile-header').sticky({topSpacing:3, zIndex: 99});
    getJSON('https://cdn.protograph.pykih.com/579747381e1f4a91c452f854/index.json', function (err, data){
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        data.map((d,i) => {
          let createDiv = document.createElement('div');
          createDiv.id = 'ProtoCard-article'+i
          createDiv.className= 'ProtoCard-article'
          document.getElementById('display-stories').appendChild(createDiv);
          new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, data[i].default_view);
        })
      }
    });
  }
  $(".banner-div a:empty").parent("p").css("display", "none");

  //twitter chatter
  getJSON('https://cdn.protograph.pykih.com/jal-jagran/twitter.json', function (err, data){
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        let tweets = '';
        data.map((d,i) => {
          let new_date = d.date.split(" "),
            month = new_date[0].slice(0,3),
            day = new_date[1],
            year = new_date[2];
          tweets += '<a href="'+d.canonical+'" target="_blank" class="protograph-url"><div class="proto-card tolink-card">'+
            '<div class="briefs-layout">'+
              '<div class="card-text">' + d.description + '</div>'+
              '<div class="by-time-line">'+
                '<div class="by-line protograph-house-color">' + d.author + '</div>'+
              '</div>'+
              '<div class="hint-text">'+ month +" "+day+ " "+ year+'</div>'+
            '</div>'+
          '</div></a>';
        document.getElementById('display-tweets').innerHTML = tweets;
        })
      }
  })

  //articles section
  // setTimeout(()=>{
  //   getJSON('https://cdn.protograph.pykih.com/579747381e1f4a91c452f854/index.json', function (err, data){
  //     if (err != null) {
  //       alert('Something went wrong: ' + err);
  //     } else {
  //       data.map((d,i) => {
  //         let createDiv = document.createElement('div');
  //         createDiv.id = 'ProtoCard-article'+i
  //         createDiv.className= 'ProtoCard-article'
  //         document.getElementById('display-stories').appendChild(createDiv);
  //         new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, data[i].default_view);
  //       })
  //     }
  //   });
  // },1000);

  let interval = setInterval(function(){
    getJSON('https://cdn.protograph.pykih.com/jal-jagran/twitter.json', function (err, data){
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        let tweets = '';
        data.map((d,i) => {
          let new_date = d.date.split(" "),
            month = new_date[0].slice(0,3),
            day = new_date[1],
            year = new_date[2];
          tweets += '<a href="'+d.canonical+'" target="_blank" class="protograph-url"><div class="proto-card tolink-card">'+
            '<div class="briefs-layout">'+
              '<div class="card-text">' + d.description + '</div>'+
              '<div class="by-time-line">'+
                '<div class="by-line">' + d.author + '</div>'+
              '</div>'+
              '<div class="hint-text">'+  month +" "+day+ " "+ year+'</div>'+
            '</div>'+
          '</div></a>';
        document.getElementById('display-tweets').innerHTML = tweets;
        })
      }
    })
  }, 60000)

  //Code to move tabs
  if (mode === 'mobile') {
    //Set Tab counts and container counts.
    $('.protograph-app-tabs-container .protograph-app-tab').each((i, e) => {
      $(e).attr('data-tab', i);
      var active_tab = $(e).hasClass('protograph-app-active-tab');
      if (active_tab) {
        var tab_content = ($('.protograph-app-3col-grid').children())[i];
        $(tab_content).addClass('protograph-app-active-tab-content');
      }
    });

    setTimeout((e)=> {
      $('.protograph-app-swipe-left').css('display', 'none');
    }, 5000);

    $('#dropdownMenuButton').on('click', (e) => {
      $('.protograph-app-navbar').addClass('protograph-app-navbar-slide-in');
      $('body').css('overflow', 'hidden');
      $('.container.proto-container').css('overflow', 'hidden');
    });
    $('#protograph_app_close_menu').on('click', (e) => {
      $('.protograph-app-navbar').removeClass('protograph-app-navbar-slide-in');
      $('body').css('overflow', 'initial');
      $('.container.proto-container').css('overflow', 'initial');
    });


    $('body').on('touchstart', ((e) =>  touch.swipeStart(e)));
    $('body').on('touchmove', ((e) =>  touch.swipeMove(e)));
    $('body').on('touchend', ((e) =>  touch.swipeEnd(e,
      ((e) => {
        swipeEndCallback(e, 'left');
      }),
      ((e) => {
        swipeEndCallback(e, 'right');
      }),
      empty,
      empty,
    )));
  }
});

function getScreenSize() {
  let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight|| e.clientHeight|| g.clientHeight;

  return {
    width: width,
    height: height
  };
}