module.exports = function(options) {
return `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>#jal-jagran</title>
    <link rel="stylesheet" type="text/css" href="./../jaljagran-lib.min.css">
    <link rel="stylesheet" type="text/css" href="./../lib/css/protograph-theme.min.css">
    <link rel="stylesheet" type="text/css" href="./../jaljagran-home.min.css">
    <script type="text/javascript">
      var siteId, origin, base_url;
      // Setting variables from environment
      origin = window.location.origin;
      if (location.hostname === "cdn.protograph.pykih.com") {
        siteId = '1';
      }

      if(siteId){
        var _paq = _paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        _paq.push(['trackEvent', '#jal-jagran', 'page_view', "${options.district_name_eng}" ]);
        (function() {
          var u="//protograph.innocraft.cloud/";
          _paq.push(['setTrackerUrl', u+'piwik.php']);
          _paq.push(['setSiteId', siteId]);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
        })();
      }
    </script>
  </head>
  <body class="index-page">
    <div class="container proto-container protograph-district-page">
      <div class="col-sm-16 no-padding-col">
        <div class="mobile-header">
          <div class="mobbed-title-mobile">
            <div class="page-navigation-mobile">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle page-name" type="button" id="dropdownMenuButton" >
                  <img class="protograph-menu-icon" src="../img/new-menu-icon.png" width="30px">
                </button>
                <span class="protograph-app-navbar-page-title">डेटा</span> 
                <img class="protograph-menu-logo" src="../img/jj-logo.png">
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-2 no-padding-col protograph-app-navbar protograph-district-page-navbar">
          <div class="protograph-app-navbar-content filter-column">
            <div id="protograph_app_close_menu" class="protograph-app-menu-mobile-cross"></div>              
            <div class="protograph-app-navbar-logo-container">
              <div class="protograph-app-navbar-hashtag">#jal-jagran</div>
              <a href="../index.html">
                <img class="protograph-app-navbar-logo-image" src="../img/jj-logo.png" width="100%">
              </a>
            </div>
            <div class="protograph-app-links-holder">
              <a class="sidebar-url" href="../index.html">
                <div class="protograph-app-navbar-option">
                  <div class="category-name">कवरेज</div>
                </div>
              </a>
              <a class="sidebar-url" href="../data.html">
                <div class="protograph-app-navbar-option protograph-app-navbar-option-active no-border-bottom">
                  <div class="category-name">डेटा</div>
                </div>
              </a>
            </div>
            <div class="social-options page-bottom protograph-app-social-share-buttons">
              <a href="http://www.facebook.com/sharer/sharer.php?u=https://cdn.protograph.pykih.com/jal-jagran/index.html" target="_blank" class="share-btn facebook">
                <i class="fa fa-facebook"></i>
              </a>
              <a href="http://twitter.com/share?url=https://cdn.protograph.pykih.com/jal-jagran/index.html" target="_blank" class="share-btn twitter">
                <i class="fa fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-sm-14 protograph-app-main-container protograph-district-page-main-container">
          <div class="col-sm-16 protograph-app-intro-holder article-page-cover">
            <div class="col-sm-6 protograph-app-hashtag-container">
              <div class="protograph-app-hashtag-group">
                <div class="protograph-app-hashtag">${options.district_name}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-4"></div>
          <div class="col-sm-9 no-padding-col protograph-district-page-card-container">
            <div id='card-list-div1'></div>
            <div id='card-list-div2'></div>
            <div id='card-list-div3'></div>
            <div id='card-list-div4'></div>
            <div id='card-list-div5'></div>
          </div>
          <div class="protograph-page-space"></div>
        </div>
      </div>
    </div>
    <script src="../lib/js/jquery.min.js"></script>
    <script type='text/javascript' src='../jaljagran-lib.min.js'></script>
    <script src="https://cdn.protograph.pykih.com/lib/protoGraph.min.js"></script>
    <script type='text/javascript' src='../jaljagran-district.min.js'></script>
    <script>
      ${options.code}
    </script>
  </body>
</html>
`
}