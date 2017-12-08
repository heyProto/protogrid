import React from 'react';

export default class Filter extends React.Component {

  constructor(props) {
    super(props);

    var filterJSON = this.props.filterJSON.map((e, i) => {
      e.id = this.uuidv4();
      e.parent_ids = [i];
      e.filters = this.setIDs(e.parent_ids, e.filters);
      return e;
    });
    filterJSON[0].is_active = true;

    var stateVars = {
      moveIn: undefined,
      moveOut: undefined,
      showAllFilters: undefined,
      activeTab: 0,
      currentViewLevel: 0,
      filterParams: [],
      filteredData: [],
      allFilters: {},
      dataJSON: this.props.dataJSON,
      filterJSON: filterJSON,
      activeTabJSON: this.props.filterJSON.filter((e,i) => {return e.is_active === true;})
    },
    itemsJSON = stateVars.activeTabJSON;
    for(let i = 0; i <= stateVars.currentViewLevel; i++) {
      itemsJSON = itemsJSON.reduce((filtered, data) => {
        if (data.is_active) {
          filtered = filtered.concat(data);
        }
        return filtered;
      }, [])
    }
    stateVars.itemsJSON = itemsJSON[0];
    this.state = stateVars;

    this.moveIn = this.moveIn.bind(this);
    this.registerFilter = this.registerFilter.bind(this);
    this.unRegisterFilter = this.unRegisterFilter.bind(this);

    this.showAllFilters = this.showAllFilters.bind(this);
    this.hideAllFilters = this.hideAllFilters.bind(this);
  }

  setIDs(previous_ids, items) {
    return items.map((e, i) => {
      e.id = this.uuidv4();
      e.parent_ids = [...previous_ids, i];
      if(e.filters && e.filters.length > 0) {
        e.filters = this.setIDs(e.parent_ids, e.filters)
      }
      return e;
    });
  }

  onChange() {
    this.props.onChange(this.state.filteredData);
  }

  arrayDifference(newArr, oldArr) {
    return oldArr.filter((e, i) => {
      return !newArr.find((f, j) => { return f.name === e.name })
    })
  }

  componentWillReceiveProps(nextProps) {
    let activeTab = this.state.activeTab,
      newFilterJSON = nextProps.filterJSON,
      filterJSON = this.state.filterJSON,
      filterParams = this.state.filterParams,
      activeTabJSON,
      tabJSON,
      parent_ids,
      f,
      h;

    newFilterJSON.map((e, i) => {
      e.id = this.uuidv4();
      e.parent_ids = [i];
      e.filters = this.setIDs(e.parent_ids, e.filters);
      return e;
    });

    newFilterJSON.forEach((e, i) => {
      f = filterJSON[i];
      e.filters.forEach((g, j) => {
        h = f.filters[j];

        h.filters.forEach((x) => {
          let new_filter = g.filters.find((y) => { return y.name === x.name })
          if (new_filter) {
            // x.id = new_filter.id;
            x.count = new_filter.count;
            // x.parent_ids = new_filter.parent_ids;
            x.is_hidden = undefined;
          } else {
            x.is_hidden = true;
          }
        });
      })
    })


    activeTabJSON = [filterJSON[activeTab]];

    this.setState({
      filterJSON: filterJSON,
      activeTabJSON: activeTabJSON
    });
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  handleReset(e) {
    let filterParams = this.state.filterParams,
      filterJSON = this.state.filterJSON,
      tempJSON,
      parent_ids;

    if (!filterParams.length) {
      return;
    }

    filterParams.forEach((e) => {
      parent_ids = e.parent_ids;
      for ( let i = 0; i < parent_ids.length; i++) {
        if (i === 0) {
          tempJSON = filterJSON[parent_ids[i]]
        } else {
          tempJSON = tempJSON.filters[parent_ids[i]];
          tempJSON.is_active = false;
        }
      }
    });

    this.setState({
      filterParams: [],
      allFilters: {},
      showAllFilters: false,
      filterJSON: filterJSON
    }, this.filterData)
  }

  //Reset the currentViewLevel
  handleTabClick (e) {
    var tabID = +e.target.closest('.protograph-filters-tab').getAttribute('data-tab_id'),
      activeTab = document.querySelector('.protograph-filters-tab.protograph-filters-tab-active'),
      activeTabId = activeTab.getAttribute('data-tab_id'),
      filterJSON = this.state.filterJSON,
      currentViewLevel = 0,
      activeTabJSON;

    filterJSON[activeTabId].is_active = false;
    filterJSON[tabID].is_active = true;

    activeTabJSON = this.props.filterJSON.filter((e,i) => {return e.is_active === true;})

    this.setState({
      activeTab: tabID,
      filterJSON: filterJSON,
      activeTabJSON: activeTabJSON,
      itemsJSON: activeTabJSON[0],
      currentViewLevel: currentViewLevel
    });
  }

  moveIn(e) {
    var itemID = +e.target.closest('.protograph-filter-item').getAttribute('data-item_id'),
      currentViewLevel = this.state.currentViewLevel + 1,
      items = this.state.itemsJSON.filters[itemID];

    this.setState({
      moveIn: true
    }, ((e) => {
      setTimeout((x) => {
        this.setState({
          moveIn: false,
          itemsJSON: items,
          currentViewLevel: currentViewLevel
        })
      }, 500);
    }));
  }

  moveOut(e) {
    var itemID = +e.target.closest('.protograph-filter-item.protograph-filters-dulled').getAttribute('data-item_id'),
      currentViewLevel = this.state.currentViewLevel - 1,
      itemsJSON = this.state.activeTabJSON;

    for(let i = 0; i <= currentViewLevel; i++) {
      itemsJSON = itemsJSON.reduce((filtered, data) => {
        if (data.is_active) {
          filtered = filtered.concat(data);
        }
        return filtered;
      }, [])
    }
    itemsJSON = itemsJSON[0];

    this.setState({
      moveOut: true
    }, ((e) => {
      setTimeout((x) => {
        this.setState({
          moveOut: false,
          itemsJSON: itemsJSON,
          currentViewLevel: currentViewLevel
        })
      }, 500);
    }));
  }

  registerFilter(e) {
    //Set filterParams
    //Update the filterJSON: Mark the filters as active.
    var itemID = +e.target.closest('.protograph-filter-item').getAttribute('data-item_id'),
      item = this.state.itemsJSON.filters[itemID],
      parent_ids = item.parent_ids,
      filterJSON = this.state.filterJSON,
      tempJSON = filterJSON[parent_ids[0]],
      filterParams = this.state.filterParams,
      allFilters = this.state.allFilters,
      activeTabJSON;

    filterParams.push(item);

    for (let i = 1; i < parent_ids.length; i++) {
      tempJSON.filters[parent_ids[i]].is_active = true;
      tempJSON = tempJSON.filters[parent_ids[i]];
    }

    activeTabJSON = [filterJSON[parent_ids[0]]];

    allFilters = this.groupAllFilters(filterParams, filterJSON);

    this.setState({
      filterJSON: filterJSON,
      activeTabJSON: activeTabJSON,
      filterParams: filterParams,
      allFilters: allFilters
    }, this.filterData);
  }

  unRegisterFilter(e) {
    var itemID = +e.target.closest('.protograph-filter-item').getAttribute('data-item_id'),
      item = this.state.itemsJSON.filters[itemID],
      parent_ids = item.parent_ids,
      filterJSON = this.state.filterJSON,
      tempJSON = filterJSON[parent_ids[0]],
      filterParams = this.state.filterParams,
      allFilters,
      activeTabJSON;

    filterParams = filterParams.filter((e, i ) => {
      return e.id !== item.id;
    });

    for (let i = 1; i < parent_ids.length; i++) {
      tempJSON.filters[parent_ids[i]].is_active = undefined;
      tempJSON = tempJSON.filters[parent_ids[i]];
    }

    activeTabJSON = [filterJSON[parent_ids[0]]];
    allFilters = this.groupAllFilters(filterParams, filterJSON);
    this.setState({
      filterJSON: filterJSON,
      activeTabJSON: activeTabJSON,
      filterParams: filterParams,
      allFilters: allFilters
    }, this.filterData);
  }

  filterData() {
    let filterParams = this.state.filterParams,
      dataJSON = this.state.dataJSON;

    filterParams.forEach((e, i) => {
      dataJSON = dataJSON.filter((f, j) => {
        return this.getDataValue(f, e) === e.value
      });
    });

    this.setState({
      filteredData: dataJSON
    }, this.onChange);
  }

  getDataValue(data, filter_obj) {
    var filterJSON = this.state.filterJSON,
      parent_ids = filter_obj.parent_ids,
      activeTabJSON = this.state.filterJSON[parent_ids[0]],
      filters;

    for (let i = 1; i < parent_ids.length - 1; i++) {
      data = data[activeTabJSON.filters[parent_ids[i]].key]
      activeTabJSON = activeTabJSON.filters[parent_ids[i]];
    }
    return data;
  }

  groupAllFilters(filterParams, filterJSON) {
    let allFilters = {},
      tempJSON,
      parent_ids;

    if (!filterParams.length) {
      return allFilters;
    }

    filterParams.forEach((e) => {
      parent_ids = e.parent_ids;
      for ( let i = 0; i < parent_ids.length; i++) {
        if (i === 0) {
          tempJSON = filterJSON[parent_ids[i]]
        } else {
          if (i > 0 && i < parent_ids.length - 1) {
            tempJSON = tempJSON.filters[parent_ids[i]];
            allFilters[tempJSON.name] = allFilters[tempJSON.name] || [];
            allFilters[tempJSON.name].push(e);
            // tempJSON.is_active = false;
          }
        }
      }
    });

    return allFilters;
  }

  showAllFilters() {
    if (!this.state.filterParams.length) {
      return;
    }

    this.setState({
      showAllFilters: true
    });
  }

  hideAllFilters() {
    this.setState({
      showAllFilters: false
    });
  }

  removeFilter(e) {
    var itemDOM = e.target.closest('.protograph-filters-all-filters-group-item'),
      itemID = itemDOM.getAttribute('data-item_id'),
      itemKey = itemDOM.getAttribute('data-item_key'),
      filterParams = this.state.filterParams.filter((x) => {
        return x.id !== itemID;
      }),
      item = this.state.filterParams.filter((x) => {
        return x.id === itemID;
      })[0],
      allFilters = this.state.allFilters,
      parent_ids = item.parent_ids,
      filterJSON = this.state.filterJSON,
      tempJSON = filterJSON[parent_ids[0]],
      showAllFilters = this.state.showAllFilters,
      activeTabJSON;

    allFilters[itemKey] = allFilters[itemKey].filter((x) => {
      return x.id !== itemID;
    });

    if (!allFilters[itemKey].length) {
      delete allFilters[itemKey]
    }

    if (!Object.keys(allFilters).length) {
      showAllFilters = false;
    }

    for (let i = 1; i < parent_ids.length; i++) {
      tempJSON.filters[parent_ids[i]].is_active = undefined;
      tempJSON = tempJSON.filters[parent_ids[i]];
    }

    activeTabJSON = [filterJSON[parent_ids[0]]];
    this.setState({
      showAllFilters: showAllFilters,
      allFilters: allFilters,
      filterJSON: filterJSON,
      activeTabJSON: activeTabJSON,
      filterParams: filterParams
    }, this.filterData);
  }

  getStyleString() {
    return `
      .protograph-house-color {
        color: ${this.props.configurationJSON.colors.house_color};
      }
      .protograph-filter-item:hover, .protograph-active-item {
        color: ${this.props.configurationJSON.colors.active_text_color};
      }
      .protograph-house-bg-color, .protograph-filters-header, .protograph-filters-all-filters {
        background-color: ${this.props.configurationJSON.colors.house_color};
      }
      .protograph-filters-tab.protograph-filters-tab-active {
        border-bottom: ${this.props.configurationJSON.colors.house_color};
      }
      .protograph-filters-header, .protograph-filters-all-filters-group-item-name, .protograph-filters-all-filters-group-item-cross, .protograph-filters-all-filters-group-item-number {
        color: ${this.props.configurationJSON.colors.filter_summary_text_color};
      }
      .protograph-filters-all-filters-group-heading {
        color: ${this.props.configurationJSON.colors.filter_heading_text_color};
      }
    `
  }

  generateListOfAllFilters() {
    let allFilters = this.state.allFilters,
      allFilterHeadings = Object.keys(allFilters);

    var transition_css = [];
    if(this.state.showAllFilters) {
      transition_css.push('protograph-filters-open');
    }

    return (
      <div className={`protograph-filters-all-filters ${transition_css.join(' ')}`}>
        {
          allFilterHeadings.map((e, i) => {
            return (
              <div key={i} className="protograph-filters-all-filters-group">
                <div className="protograph-filters-all-filters-group-heading">
                  {e}
                </div>
                {
                  allFilters[e].map((f, j) => {
                    return (
                      <div key={j} className="protograph-filters-all-filters-group-item" data-item_id={f.id} data-item_key={e}>
                        <div className="protograph-filters-all-filters-group-item-name">
                          {f.name}
                        </div>
                        <div className="protograph-filters-all-filters-group-item-cross" onClick={((e) => { this.removeFilter(e);})}>
                          ×
                        </div>
                        <div className="protograph-filters-all-filters-group-item-number">
                          {f.count}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }

  generateList() {
    var transition_css = [];
    if (this.state.moveIn) {
      transition_css.push('protograph-filters-move-in');
    }
    if (this.state.moveOut) {
      transition_css.push('protograph-filters-move-out');
    }
    return (
      <div className={`protograph-filter-items-container`} >
        <div className={`protograph-filter-items-inner-container  ${transition_css.length > 0 ? transition_css.join(' ') : ''}`}>
          {
            this.state.currentViewLevel >= 1 &&
              <div
                className="protograph-filter-item protograph-filters-dulled"
                onClick={((e) => {this.moveOut(e);})}
              >
                <div className="protograph-filter-item-arrow protograph-filters-left-align  protograph-filters-dulled"> &lt; </div>
                <div className="protograph-filter-item-name" >
                  {this.state.itemsJSON.name}
                </div>
              </div>
          }
          {
            this.state.itemsJSON.filters.map((e, i) => {
              if (e.is_hidden) {
                return <div key={i} />;
              }

              let onClickCallback;
              if(e.filters && e.filters.length > 0) {
                onClickCallback = this.moveIn;
              } else {
                onClickCallback = e.is_active ? this.unRegisterFilter : this.registerFilter;
              }


              return (
                <div
                  key={i}
                  className={`protograph-filter-item ${e.is_active ? 'protograph-active-item' : ''}`}
                  onClick={((e) => {onClickCallback(e)})}
                  data-item_id={i}
                >
                  <div className="protograph-filter-item-name" >
                    {e.name}
                  </div>
                  {
                    (e.filters && e.filters.length > 0) ?
                      <div className="protograph-filter-item-arrow" > &gt; </div>
                    :
                      <div className="protograph-filter-item-arrow" > {e.count} </div>
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    let filterToggleCallback = !this.state.showAllFilters ? this.showAllFilters :  this.hideAllFilters;
    let styles = this.getStyleString();
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: styles}} />
        <div className="protograph-filters-container">
          <div className="protograph-filters-header">
            <span className="protograph-filters-active-count">{this.state.filterParams.length}</span>
            <span  className="protograph-filters-selected-filter-toggle"
              onClick={((e) => { filterToggleCallback(e); })}>
                {this.props.configurationJSON.selected_heading}
                <div className={`protograph-filters-caret ${!this.state.showAllFilters ? 'protograph-filters-180-caret' : ''}`}> &and; </div>
            </span>
            <span  className="protograph-filters-reset-filter" onClick={((e) => {this.handleReset(e);})}>{this.props.configurationJSON.reset_filter_text}</span>
          </div>
          {
            this.generateListOfAllFilters()
          }
          { this.state.filterJSON.length > 1 &&
              <div className="protograph-filters-tabs-container">
                {
                  this.state.filterJSON.map((e,i)=> {
                    return(
                      <div
                        key={i}
                        id={`protograph_filter_tab_${i}`}
                        data-tab_id={i}
                        className={`protograph-filters-tab ${e.is_active ? 'protograph-filters-tab-active' : ''}`}
                        onClick={((e) => { this.handleTabClick(e) })}
                      >
                        {e.name}
                      </div>
                    )
                  })
                }
              </div>
          }
          { this.state.filterJSON.length >= 1 &&
              this.generateList()
          }
        </div>
      </div>
    );
  }
}
