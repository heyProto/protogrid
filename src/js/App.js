import React from 'react';
import axios from 'axios';
import Halogen from 'halogen';
import List from '../js/List';
import Map from '../js/Map';
import Utils from '../js/Utils';
import {timeFormat} from 'd3-time-format';
import Filter from "./filter.js";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataJSON: undefined,
      topoJSON: {},
      category: null,
      filterJSON: [],
      filteredDataJSON: undefined,
      filters: this.props.filters
    }
    // this.handleCircleClicked = this.handleCircleClicked.bind(this);
    // this.handleSelectDateRange = this.handleSelectDateRange.bind(this);
  }

  componentDidMount() {
    const {dataURL, topoURL} = this.props;
    axios.all([axios.get(dataURL), axios.get(topoURL)])
      .then(axios.spread((card, topo) => {

        let all_data_keys = ["decadal_decrease_score", "rainfall_deficit_score", "land_score", "forest_score", "population_score"],
          districts_not_in_map = ["Amethi", "Hapur", "Sambhal", "Shamli"],
          data,
          filters,
          filterJSON;

        data = card.data.filter((e) => districts_not_in_map.indexOf(e.district) === -1 )

        data = data.map((e) => {
            all_data_keys.forEach((f) => {
              e[f] = e[f] || "उपलब्ध नहीं"
            });
            return e;
        });

        filters = this.state.filters.map((filter) => {
          return {
            name: filter.alias,
            key: filter.propName,
            filters: this.sortObject(Utils.groupBy(data, filter.propName), filter)
          }
        });

        filterJSON = [
          {
            name: "Tab - 1",
            filters: filters
          }
        ];

        this.setState({
          dataJSON: data,
          filteredDataJSON: data,
          topoJSON: topo.data,
          filterJSON: filterJSON
        });
    }));
    let dimension = this.getScreenSize();

    if(this.props.mode === 'laptop') {
      $('.filter-col').sticky({topSpacing:0});
      $('.banner-area .sticky-wrapper').css('float', 'left');
      $('.banner-area .sticky-wrapper').css("display", 'inline-block');
    }

    //Polyfill for element.closest in old browsers.
    if (window.Element && !Element.prototype.closest) {
      Element.prototype.closest =
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
          do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) { };
          } while ((i < 0) && (el = el.parentElement));
          return el;
        };
    }
  }

  componentDidUpdate() {
    if(this.props.mode === 'laptop') {
      $('.filter-col').sticky({topSpacing:0});
      $('.banner-area .sticky-wrapper').css('float', 'left');
      $('.banner-area .sticky-wrapper').css("display", 'inline-block');
    }

    // $('#myTab a').on('click', function (e) {
    //   e.preventDefault()
    //   $(this).tab('show')
    // });

    $(".tabs-area .single-tab").on("click", function(e){
      $(".single-tab").removeClass("active-tab");
      $(this).addClass("active-tab");
      $(".tabs.active-area").removeClass("active-area");
      $(".tabs"+this.dataset.href).addClass("active-area");
    });

  }

  renderStars(d) {
    let stars = [],
      i;
    if (d.value === "उपलब्ध नहीं") {
      return d.name;
    }
    for (i = 0; i < 5; i++) {
      if (i < d.value) {
        stars.push(<i key={i} className="star icon"></i>);
      } else {
        stars.push(<i key={i} className="empty star icon"></i>);
      }
    }
    return stars.map((e,i) => {
      return (
        e
      )
    });
  }

  sortObject(obj, filter) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          'name': `रेटिंग - ${prop}`,
          'renderName': this.renderStars,
          'value': prop,
          'count': obj[prop].length
        });
      }
    }
    arr.sort(function (a, b) {
      let key1 = a.value,
        key2 = b.value;
      if (key1 < key2) {
        return -1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return 1;
      }
    });
    return arr; // returns array
  }

  onChange(filteredData) {
    let filtDat = this.state.filters.map((filter) => {
      return {
        name: filter.alias,
        key: filter.propName,
        filters: this.sortObject(Utils.groupBy(filteredData, filter.propName), filter)
      }
    });

    let filterJSON = [
      {
        name: "Tab - 1",
        filters: filtDat
      }
    ];

    this.setState({
      filteredDataJSON: filteredData,
      filterJSON: filterJSON
    });
  }

  renderLaptop() {
    if (this.state.dataJSON === undefined) {
      let color = '#007cd7';

      let style = {
        display: '-webkit-flex',
        display: 'flex',
        WebkitFlex: '0 1 auto',
        flex: '0 1 auto',
        WebkitFlexDirection: 'column',
        flexDirection: 'column',
        WebkitFlexGrow: 1,
        flexGrow: 1,
        WebkitFlexShrink: 0,
        flexShrink: 0,
        WebkitFlexBasis: '100%',
        flexBasis: '100%',
        maxWidth: '100%',
        height: '200px',
        WebkitAlignItems: 'center',
        alignItems: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center'
      };
      return(
       <div style={{
          boxSizing: 'border-box',
          display: '-webkit-flex',
          display: 'flex',
          WebkitFlex: '0 1 auto',
          flex: '0 1 auto',
          WebkitFlexDirection: 'row',
          flexDirection: 'row',
          WebkitFlexWrap: 'wrap',
          flexWrap: 'wrap',
          clear: 'both'
        }}>
          <div style={style}><Halogen.RiseLoader color={color}/></div>
        </div>
      )
    } else {
      $('.social-share-icons').css("display", "block")
      return (
        <div className="banner-area">
          <div className="proto-col col-4 filter-col parent-col protograph-filter-area">
            <Filter
              configurationJSON={this.props.filterConfigurationJSON}
              dataJSON={this.state.filteredDataJSON}
              filterJSON={this.state.filterJSON}
              onChange={(e) => {this.onChange(e);}}
            />
          </div>
          <div className="proto-col col-10 protograph-app-map-and-list">
              <div className="tabs-area">
              <div className="single-tab active-tab" id='map-tab' data-href='#map-area' >नक्शा</div>
              <div className="single-tab" id='list-tab' data-href='#list-area'>सूची</div>
              </div>
              <div className="tabs map-area active-area" id='map-area'><Map dataJSON={this.state.filteredDataJSON} topoJSON={this.state.topoJSON} chartOptions={this.props.chartOptions} mode={this.props.mode} /></div>
              <div className="tabs list-area" id='list-area'><List dataJSON={this.state.filteredDataJSON} mode={this.props.mode} /></div>
          </div>
        </div>
      )
    }
  }

  render() {
    return this.renderLaptop();
  }

  getScreenSize() {
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
}

export default App;

