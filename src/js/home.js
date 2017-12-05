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
// function debounce(func, wait, immediate) {
//   var timeout;
//   return function () {
//     var context = this, args = arguments;
//     var later = function () {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     var callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// };
const swipeEndCallback = function(e, direction) {
  var current_tab = $('.protograph-app-tabs-container .protograph-app-tab.protograph-app-active-tab'),
    current_tab_count,
    current_tab_content = $('.protograph-app-active-tab-content:last');

  current_tab = $(current_tab);
  current_tab_count = +current_tab.attr('data-tab');
  console.log(lastScrollTop, ";;;;")
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
          setTimeout(function() {
            current_tab.addClass('protograph-app-active-tab');
          }, 250);

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
      twitter_container,
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
    twitter_container = document.getElementById('display-tweets');
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
                $('.briefs-column').sticky({"widthFromWrapper": false});
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
    }, 2000);
  } else {
    article_container = document.getElementById('mobile-display-stories');
    twitter_container = document.getElementById('mobile-display-tweets');

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
        twitter_container.innerHTML = tweets;
        })
      }
  })

  setInterval(function(){
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
        twitter_container.innerHTML = tweets;
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
        var tab_content = $('.protograph-tab-content')[i];
        $(tab_content).addClass('protograph-app-active-tab-content');
      }
    });

    setTimeout((e)=> {
      $('.protograph-app-swipe-left').addClass('protograph-app-slide-down');
      console.log($('.protograph-app-swipe-left'), ";;;;");
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

    $('.left-interaction-overlay, .right-interaction-overlay').on('click', (e) => {
      var $target = $(e.target);
      if ($target.length) {
        $target.hide();
        var iframe = $(document.elementFromPoint(e.clientX, e.clientY))
        debugger;
        $(document.elementFromPoint(e.clientX, e.clientY)).trigger("click");
        console.log($(document.elementFromPoint(e.clientX, e.clientY)), "sssssss")
        setTimeout(function() {
          $target.show();
        }, 10);
      }
    });

    $('.protograph-app-main-container').scroll(throttle(function (event) {
      var st = $('.protograph-app-main-container').scrollTop(),
      isActive = $('.protograph-app-swipe-left').hasClass('protograph-app-slide-down');
        if (st > lastScrollTop) {
          // downscroll code
          if (isActive) {
            $('.protograph-app-swipe-left').removeClass('protograph-app-slide-down');
          }
        } else {
          // upscroll code
          if (!isActive) {
            $('.protograph-app-swipe-left').addClass('protograph-app-slide-down');
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