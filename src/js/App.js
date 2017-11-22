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
        let filters = this.state.filters.map((filter) => {
          return {
            name: filter.alias,
            key: filter.propName,
            filters: this.sortObject(Utils.groupBy(card.data, filter.propName), filter)
          }
        });
        let filterJSON = [
          {
            name: "Tab - 1",
            filters: filters
          }
        ]

        this.setState({
          dataJSON: card.data,
          filteredDataJSON: card.data,
          topoJSON: topo.data,
          filterJSON: filterJSON
        });
    }));
    let dimension = this.getScreenSize();

    if(this.props.mode === 'laptop') {
      $('.filter-area').sticky({topSpacing:0});
      $('.banner-area .sticky-wrapper').css('float', 'left');
      $('.banner-area .sticky-wrapper').css("display", 'inline-block');
    }

  }

  componentDidUpdate() {
    if(this.props.mode === 'laptop') {
      $('.filter-area').sticky({topSpacing:0});
      $('.banner-area .sticky-wrapper').css('float', 'left');
      $('.banner-area .sticky-wrapper').css("display", 'inline-block');
    }

    $('#myTab a').on('click', function (e) {
      e.preventDefault()
      $(this).tab('show')
    });
  }

  sortObject(obj, filter) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          'name': `रेटिंग - ${prop}`,
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
    ]

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
        }}>
          <div style={style}><Halogen.RiseLoader color={color}/></div>
        </div>
      )
    } else {
      $('.social-share-icons').css("display", "block")
      return (
        <div className="banner-area">
          <div className="col-sm-6 filter-area sidenav" style={{left: this.state.sidebar_left}}>
            <Filter
              configurationJSON={this.props.filterConfigurationJSON}
              dataJSON={this.state.filteredDataJSON}
              filterJSON={this.state.filterJSON}
              onChange={(e) => {this.onChange(e);}}
            />
          </div>
          <div className="col-sm-10 no-padding-col data-page-cards">
            <div className="protograph-container">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a className="nav-link protograph-app-nav-tabs active" id="map-tab" data-toggle="tab" href="#map" role="tab" aria-controls="map" aria-selected="true">नक्शा</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link protograph-app-nav-tabs" id="list-tab" data-toggle="tab" href="#list" role="tab" aria-controls="list" aria-selected="false">सूची</a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="map" role="tabpanel" aria-labelledby="map-tab">
                  <Map dataJSON={this.state.filteredDataJSON} topoJSON={this.state.topoJSON} chartOptions={this.props.chartOptions} mode={this.props.mode} />
                </div>
                <div className="tab-pane fade" id="list" role="tabpanel" aria-labelledby="list-tab">
                  <List dataJSON={this.state.filteredDataJSON} mode={this.props.mode} />
                </div>
              </div>
            </div>
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

