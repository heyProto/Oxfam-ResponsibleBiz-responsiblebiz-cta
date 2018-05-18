import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCreditsCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      optionalConfigJSON: {},
      image_count: 1
    };
    this.links_counter = 0;

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }
    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }
    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];
      axios.all(items_to_fetch).then(axios.spread((card) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: {
            card_data: card.data
          },
          optionalConfigJSON: {}
        };
        this.setState(stateVar);
      }));
    } else {
      // this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  onClickFirstExpand(e){
    document.querySelector(".col-16-tool-strip").style.height = "250px"
    document.querySelectorAll(".verticle-divider").forEach((d, i) => {
      document.querySelectorAll(".verticle-divider")[i].style.height = "230px"
    })   
  }

  renderCol16(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data,
        card_1 = this.state.dataJSON.card_data.data.card_1,
        card_2 = this.state.dataJSON.card_data.data.card_2,
        card_3 = this.state.dataJSON.card_data.data.card_3,
        card_4 = this.state.dataJSON.card_data.data.card_4;
      return(
        <div className="col-16-tool-strip" onClick={(e) => this.onClickFirstExpand(e)}>
          <div className="col-4-tool-card">
            <div className="tool-card-title">
              <img src="img/facilities-icon.png" />
              {card_1.title}
              <img src="img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <p>Find the nearest health facilities around you</p>
            <input type="text" name="area" className="area-input" placeholder="Start typing the name of your area" />
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button">
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title">
              <img src="img/pharmacies-icon.png" />
              {card_2.title}
              <img src="img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <p>Find pharmacies</p>
            <input type="text" name="location" className="location-input" placeholder="Search by location" />
            <input type="text" name="pharmacie-name" className="pharmacie-name-input" placeholder="Search by pharmacie name" />
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button">
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title">
              <img src="img/meds-icon.png" />
              {card_3.title}
              <img src="img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <p>How much do you pay for drugs?</p>
            <input type="text" name="drug-name" className="drug-name-input" placeholder="Drug Name" />
            <input type="text" name="dose" className="dose-input" placeholder="No. of dose" />
            <input type="text" name="price" className="price-input" placeholder="Buying price" />
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button">
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title">
              <img src="img/eshangazi-icon.png" />
              {card_4.title}
              <img src="img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <div className="e-shangazi-image-area">
              <img src="img/eshangazi-logo.png" />
            </div>
            <div className="tool-call-to-action-area">
              <a href={card_4.url} target="_blank"><div className="tool-call-to-action-button">
                Talk
              </div></a>
            </div>
          </div>
        </div>
      )
    }
  }

  renderCol4(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      
    }
  }

  render() {    
    switch(this.props.mode) {
      case 'col16':
        return this.renderCol16();
      case 'col4':
        return this.renderCol4();
    }
  }
}