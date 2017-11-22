import React from 'react';
import ReactDOM from 'react-dom';
import {voronoi as d3Voronoi} from 'd3-voronoi';
// import Modal from '../js/Modal';
import Util from '../js/Utils';

class Voronoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tooltipData: this.props.onLoadTooltipData
    }
  }

  handleMouseOver(e, card, name) {
    this.props.circleHover = true;
    if (!this.props.circleClicked) { 
      Util.highlightCircle(name, card)
    }
  }

  handleOnClick(e, card, name) {
    let props = this.props; 
    $('#proto-modal').modal('show');
    $('#proto-modal').on('hidden.bs.modal', function(){
      let element = document.querySelector("#proto-embed-card iframe");
      element.parentNode.removeChild(element);
    })
    if (this.props.mode === 'laptop') {
      let pro = new ProtoEmbed.initFrame(document.getElementById("proto-embed-card"), card.iframe_url, 'laptop')
    } else {
      let pro = new ProtoEmbed.initFrame(document.getElementById("proto-embed-card"), card.iframe_url, 'mobile', true)
    } 
    $('.modal-close').click(function(){
      $("#proto-modal").modal('hide');
    });
  }

  render() {
    let projection = this.props.projection,
      voronoi = d3Voronoi()
        .x(function (d){
          return projection([d.lng, d.lat])[0]
        })
        .y(function (d){
          return projection([d.lng, d.lat])[1]
        })
        .size([this.props.width, this.props.height])(this.props.data);

    let polygons = voronoi.polygons(this.props.data),
      cleanVoronoiCells = polygons.clean(undefined);

    let styles = {
      fill: 'none',
      pointerEvents: 'all'
    }
   
    let voronoiPaths = cleanVoronoiCells.map((d, i) => {
      let name = `${d.data.view_cast_id}-${d.data.area}`
      return(
        <path style={styles}
          d={`M ${d.join("L")} Z`}
          className={`voronoi ${d.data.view_cast_id}-${d.data.area}`}
          onClick={(e) => this.handleOnClick(e, d.data, name)}
          onMouseMove={(e) => this.handleMouseOver(e, d.data, name)}
          onTouchStart={(e) => this.handleMouseOver(e, d.data, name)}
          >
        </path>
      )
    }) 

    return(
      <g className="voronoiWrapper">{voronoiPaths}</g>
    )
  }
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

export default Voronoi;
