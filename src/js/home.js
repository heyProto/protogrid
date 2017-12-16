let touch = require('./touch.js');
var lastScrollTop = 0;

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
function throttle(fn, wait) {
  var time = Date.now();
  return function () {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}
const swipeEndCallback = function(e, direction) {
  var current_tab = $('.protograph-app-tabs-container .protograph-app-tab.protograph-app-active-tab'),
    current_tab_count,
    current_tab_content = $('.protograph-app-active-tab-content:last');

  current_tab = $(current_tab);
  current_tab_count = +current_tab.attr('data-tab');

  switch(direction) {
    case 'left':
        if (current_tab_count < 2) {
          //switch tabs
          current_tab.removeClass('protograph-app-active-tab');
          var tab_id = current_tab.attr('data-tab');
          setTimeout((e) => {
            $($('.protograph-tab-content')[tab_id]).css('display', 'none');
          }, 500);

          current_tab_count += 1;
          if (current_tab_count === 0) {
            $('.mobile-header').addClass('protograph-header-home-page');
          } else {
            $('.mobile-header').removeClass('protograph-header-home-page');
          }

          current_tab = $(`.protograph-app-tab[data-tab="${current_tab_count}"]`);
          current_tab.addClass('protograph-app-active-tab');

          current_tab_content = $($('.protograph-tab-content')[current_tab_count]);
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
          $('.mobile-header').addClass('protograph-header-home-page');
        } else {
          $('.mobile-header').removeClass('protograph-header-home-page');
        }

        current_tab = $(`.protograph-app-tab[data-tab="${current_tab_count}"]`);
        current_tab.addClass('protograph-app-active-tab');

        current_tab_content = $($('.protograph-app-3col-grid').children()[current_tab_count]);
        var tab_id = current_tab.attr('data-tab');
        setTimeout(function() {
          $($('.protograph-tab-content')[tab_id]).css('display', 'inline-block');
        }, 0);
        current_tab_content.addClass('protograph-app-active-tab-content');
      }
      break;
  }
  // $('.protograph-app-swipe-left').css('display', 'none');
}

document.addEventListener("DOMContentLoaded", function(event) {

  let dimension = getScreenSize(), mode;
  var showChar,
      more_article_container,
      article_container;

  if (dimension.width <= 500){
    mode = 'mobile';
    showChar = 200
  } else {
    mode = 'laptop';
    showChar = 460;
  }

  if (mode === 'laptop'){
    article_container = document.getElementById('display-stories');
    more_article_container = document.getElementById('display_more_articles');
    // Code to animate the home screen.
    setTimeout(() => {
      $('.protograph-app-intro-holder').addClass('protograph-app-intro-holder-animate');
        setTimeout(() => {
          $('.protograph-app-3col-grid').css('display', 'block');
          $('.protograph-app-main-container').css('height', '100%');
          $('.protograph-app-main-container').css('background', 'white');
          $('.protograph-app-navbar').addClass('protograph-app-navbar-slide-in');
          setTimeout(() => {
              $('.protograph-app-3col-grid').addClass('protograph-app-3col-grid-slide-up');
              setTimeout(() => {
                $('.more-articles').sticky({"widthFromWrapper": false});
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
              article_container.appendChild(createDiv);
              new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, data[i].default_view);
            })
          }
        });

        getJSON('https://cdn.protograph.pykih.com/431c5f381a07b3c1393d6821/index.json', function (err, data) {
          if (err != null) {
            alert('Something went wrong: ' + err);
          } else {
            data.map((d, i) => {
              let createDiv = document.createElement('div');
              createDiv.id = 'ProtoCard-more-articles-' + i;
              createDiv.className = 'ProtoCard-article';
              more_article_container.appendChild(createDiv);
              new ProtoEmbed.initFrame(document.getElementById("ProtoCard-more-articles-" + i), d.iframe_url, d.default_view);
            })
          }
        });
    }, 2000);

    $(window).scroll(throttle(function (event) {
      var window_scroll_top = $(window).scrollTop(),
        hastag_offset = $('.protograph-app-hashtag').offset(),
        hastag_height = $('.protograph-app-hashtag').height(),
        hidden_hashtag = $('.protograph-app-navbar-logo-container');

      if ( window_scroll_top > (hastag_offset.top + hastag_height)) {
        // downscroll code
        if (hidden_hashtag.hasClass('protograph-hide-content')) {
          hidden_hashtag.removeClass('protograph-hide-content');
        }
      } else {
        // upscroll code
        if (!hidden_hashtag.hasClass('protograph-hide-content')) {
          hidden_hashtag.addClass('protograph-hide-content');
        }
      }
    }, 50));


  } else {
    article_container = document.getElementById('mobile-display-stories');
    more_article_container = document.getElementById('mobile_display_more_articles');

    getJSON('https://cdn.protograph.pykih.com/579747381e1f4a91c452f854/index.json', function (err, data){
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        data.map((d,i) => {
          let createDiv = document.createElement('div');
          createDiv.id = 'ProtoCard-article'+i
          createDiv.className= 'ProtoCard-article'
          article_container.appendChild(createDiv);
          new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, data[i].default_view);
        })
      }
    });

    getJSON('https://cdn.protograph.pykih.com/431c5f381a07b3c1393d6821/index.json', function (err, data) {
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        data.map((d, i) => {
          let createDiv = document.createElement('div');
          createDiv.id = 'ProtoCard-more-articles-' + i;
          createDiv.className = 'ProtoCard-article';
          more_article_container.appendChild(createDiv);
          new ProtoEmbed.initFrame(document.getElementById("ProtoCard-more-articles-" + i), d.iframe_url, d.default_view);
        })
      }
    });
  }
  $(".banner-div a:empty").parent("p").css("display", "none");

  //Code to move tabs
  if (mode === 'mobile') {
    //Set Tab counts and container counts.
    $('.protograph-app-tabs-container .protograph-app-tab').each((i, e) => {
      $(e).attr('data-tab', i);
      var active_tab = $(e).hasClass('protograph-app-active-tab');
      if (active_tab) {
        var tab_content = $('.protograph-tab-content')[i];
        $(tab_content).addClass('protograph-app-active-tab-content');
      }
    });

    setTimeout((e)=> {
      $('.protograph-app-swipe-left').addClass('protograph-app-slide-down');
    }, 3000);

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

    $('body').on('touchstart', ((e) => touch.swipeStart(e)));
    $('body').on('touchmove', ((e) => touch.swipeMove(e)));
    $('body').on('touchend touchcancel', ((e) =>  touch.swipeEnd(e,
      ((e) => {
        swipeEndCallback(e, 'left');
      }),
      ((e) => {
        swipeEndCallback(e, 'right');
      }),
      empty,
      empty,
    )));

    $('.protograph-app-main-container').scroll(throttle(function (event) {
      var st = $('.protograph-app-main-container').scrollTop(),
      isActive = $('.protograph-app-swipe-left').hasClass('protograph-app-slide-down');
        if (st > lastScrollTop) {
          // downscroll code
          if (!isActive) {
            $('.protograph-app-swipe-left').addClass('protograph-app-slide-down');
          }
        } else {
          // upscroll code
          if (isActive) {
            $('.protograph-app-swipe-left').removeClass('protograph-app-slide-down');
          }
      }
      lastScrollTop = st;
    }, 100));

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