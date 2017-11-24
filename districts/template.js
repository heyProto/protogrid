module.exports = function(options) {
return `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>#jal-jagran</title>
    <link rel="stylesheet" type="text/css" href="../src/css/proto-grid.css">
    <link rel="stylesheet" type="text/css" href="../src/css/jal-jagran-style.css">
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
    <div class="proto-container data-page">
        <div class="proto-col col-2 left-col proto-sidebar">
            <a href="../index.html">
              <div class="project-name">#jal-jagran</div>
              <div class="company-logo"><img src="../src/img/jj-logo.png" width="90%"></div>
            </a>
            <div class="sidebar-menu">
              <a href='../index.html'><div class="sidebar-menu-option">कवरेज</div></a>
              <a href='../data.html'><div class="sidebar-menu-option active-option">डेटा</div></a>
            </div>
            <div class="sidebar-footer">
                <div class="proto-branding">
                    <div class="social-share">
                      <div class="facebook-icon">
                        <a href="http://www.facebook.com/sharer/sharer.php?u=https://cdn.protograph.pykih.com/jal-jagran-2/index.html" target="_blank" class="share-btn facebook">
                          <img src="../src/img/facebook-icon.png" height="15px">
                        </a>
                      </div>
                      <div class="twitter-icon">
                        <a href="http://twitter.com/share?url=https://cdn.protograph.pykih.com/jal-jagran-2/index.html" target="_blank" class="share-btn twitter">
                           <img src="../src/img/twitter-icon.png" height="15px">
                        </a>
                      </div>
                    </div>
                    <div class="powered-by-text">Powered by</div>
                    <img class="protograph-branding" src="../src/img/proto-icon.png" width="50%">
                </div>
            </div>
        </div>
        <div class="proto-col col-2"></div>
        <div class="proto-col col-14 rigth-col parent-col">
            <div class="proto-col col-14 cover-image">
                <div class="page-title">
                  ${options.district_name}
                </div>
            </div>
            <div class="proto-col col-7">
              <div class="district-article-cards" id='card-list-div1'></div>
              <div class="district-article-cards" id='card-list-div2'></div>
              <div class="district-article-cards" id='card-list-div3'></div>
              <div class="district-article-cards" id='card-list-div4'></div>
              <div class="district-article-cards" id='card-list-div5'></div>
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