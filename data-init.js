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
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}
let dimension = getScreenSize(), mode;
var showChar;
if (dimension.width <= 500){
  mode = 'mobile';
  showChar = 200
} else {
  mode = 'laptop';
  showChar = 460;
}


$(document).ready((e) => {


  if (mode === 'laptop'){
  }

  if (mode === 'mobile'){
    var lastScrollTop = 0;
    $(window).scroll(throttle((e) => {
      var st = $(window).scrollTop();
      if (st > lastScrollTop){
          // downscroll code
          // $('.protograph-app-filter-icon').addClass('protograph-app-filter-icon-slide-down');
        } else {
          // upscroll code
          // $('.protograph-app-filter-icon.protograph-app-filter-icon-slide-down').removeClass('protograph-app-filter-icon-slide-down');
      }
      lastScrollTop = st;
    }, 500));

    $('#protograph_filter_icon').on('click', ((e) => {
      $('.protograph-filter-area').css('display', 'block');
      setTimeout((e) => {
        $('.protograph-filter-area').addClass('protograph-filter-area-slide-up');
      },0);
      $('#protograph_filter_icon').css('display', 'none');
      $('#protograph_filter_close_icon').css('display', 'block');
    }));

    $('#protograph_filter_close_icon').on('click', ((e) => {
      $('.protograph-filter-area').removeClass('protograph-filter-area-slide-up');
      setTimeout((e) => {
        $('.protograph-filter-area').css('display', 'none');
      },500);
      $('#protograph_filter_icon').css('display', 'block');
      $('#protograph_filter_close_icon').css('display', 'none');
    }));

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

var x = new ProtoGraph.Card.toMaps()
  x.init({
  selector: document.querySelector('#card-list-div'),
  dataURL: 'https://dkqrqc7q64awx.cloudfront.net/b0cf35e9943e8e913cdf57d1/index.json',
  topoURL: 'https://s3.ap-south-1.amazonaws.com/cdn.protograph/jal-jagran/uttar_pradesh-topo.json',
  chartOptions: {
    chartTitle: 'Mob Justice in India',
    height: 500,
    defaultCircleColor: '#F02E2E'
  },
  filterConfigurationJSON: {
    colors: {
      house_color: '#007cd7',
      text_color: '#343434',
      active_text_color: '#007cd7',
      filter_summary_text_color: '#ffffff',
      filter_heading_text_color: '#ffffff'
    },
    selected_heading: 'चयनित फिल्टर',
    reset_filter_text: 'रीसेट'
  },
  filters: [
    {
      propName: 'land_score',
      alias: 'भूमि उपयोग के लिए रेटिंग'
    },
    {
      propName: 'forest_score',
      alias: 'वन कवर के लिए रेटिंग'
    },
    {
      propName: 'population_score',
      alias: 'जनसंख्या के लिए रेटिंग'
    },
    {
      propName: 'rainfall_deficit_score',
      alias: 'वर्षा में घाटे के लिए रेटिंग'
    },
    {
      propName: 'decadal_decrease_score',
      alias: 'भूजल स्तर में दशमांश की कमी के लिए रेटिंग'
    }
  ]
})
x.renderLaptop();

$(document).ready(function() {
  var mode = (window.innerWidth <= 500) ? 'mobile' : 'laptop';
  if (mode === 'laptop') {
    $('.filter-column').sticky({topSpacing:0});
  }
});