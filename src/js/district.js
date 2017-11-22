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
  var ellipsestext = "...";
  var moretext = "पढ़ते रहिये";
  var lesstext = "कम दिखाएं";

  $('.project-description').each(function() {
    var content = $(this).html();

    if(content.length > showChar) {
      var c = content.substr(0, showChar);
      var h = content.substr(showChar, content.length - showChar);

      var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span><a href="" class="morelink">' + moretext + '</a></span>';

      $(this).html(html);
    }
  });

  $(".morelink").click(function(){
    if($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretext);
    } else {
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
  if (mode === 'laptop'){
    $('.filter-column').sticky();
    $("body").css("background", "-webkit-linear-gradient(left, #f1f1f1 , white)");
    $("body").css("background", "-webkit-linear-gradient(left, #f1f1f1 , white)");
    $("body").css("background", "-o-linear-gradient(left, #f1f1f1 , white)");
    $("body").css("background", "-moz-linear-gradient(left, #f1f1f1 , white)");
    $("body").css("background", "linear-gradient(left, #f1f1f1 , white)");
    $('.protograph-app-main-container').css('height', 'auto');
  } else {
    $('.mobile-header').sticky({topSpacing:0, zIndex: 99});
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