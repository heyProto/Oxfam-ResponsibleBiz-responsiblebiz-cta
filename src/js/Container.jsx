import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from "./Modal.js";
import Select from 'react-select';

export default class toCreditsCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      selectedOption: {},
      showModal: false,
      optionalConfigJSON: {},
      card_type: ''
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    
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
        axios.get(card.data.data.card_3.listing_drugs_api).then((response) => {
          console.log(card, "card", response)
          let stateVar = {
            fetchingData: false,
            dataJSON: {
              card_data: card.data
            },
            drug_data: response.data,
            optionalConfigJSON: {}
          };
          this.setState(stateVar);
          })
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

  showModal(e) {
    this.setState({
      showModal: true
    })
  }

  closeModal() {
    this.setState({
      showModal: false
    })
  }

  handleSelectOption(newSelectedOption, key){
    let selectedOption = this.state.selectedOption;
    selectedOption[key] = newSelectedOption; 
    console.log(selectedOption, "newSelection")
    this.setState({
      selectedOption: selectedOption 
    });   
  }

  getHealthFacilities(data){
    let api = data.api,
      value = document.querySelector('.area-input').value;

    axios.get(api +"?q="+ value).then((response_data) => {
      console.log(response_data)
      this.setState({
        responseData: response_data.data.facilities,
        card_type: "health_facilities",
        title: data.title
      })
    })
    this.showModal();
  }

  getPharmacies(data){
    let api = data.api,
      location = document.querySelector('.location-input').value,
      name = document.querySelector('.pharmacie-name-input').value,
      api_url = api + "?search_by=name" + "&query=" + name;

    axios.get(api_url).then((response_data) => {
      console.log(response_data)
      this.setState({
        responseData: response_data.data.pharmacies,
        card_type: "pharmacies",
        title: data.title
      })
    })
    this.showModal();
  }

  getMedicinePrices(data){
    let drug_listing = data.listing_drugs_api,
      drug_price = data.drug_price_api,
      drug_id = 1,
      dose = document.querySelector('.dose-input').value,
      buying_price = document.querySelector('.price-input').value,
      api = drug_price +"?drug_id="+drug_id+"&dose="+dose+"&buying_price="+buying_price;

    console.log(api, "api")

    axios.get(api).then((response_data) => {
      console.log(response_data)
      this.setState({
        responseData: response_data.data,
        card_type: "medicine_prices",
        title: data.title,
        buying_price: buying_price
      })
    })
    this.showModal();

  }

  onClickFirstExpand(e){
    document.querySelector(".col-16-tool-strip").style.height = "250px"
    document.querySelectorAll(".verticle-divider").forEach((d, i) => {
      document.querySelectorAll(".verticle-divider")[i].style.height = "250px"
    })   
  }

  expandOnCard1Click(e){
    document.querySelectorAll('.col-4-card-content').forEach((d, i) => {
      document.querySelectorAll('.col-4-card-content')[i].style.display = "none";
    })
    document.querySelector("#card_1").style.display = "block";
    document.querySelectorAll('.col-4-tool-card').forEach((d,i) => {
      document.querySelectorAll('.col-4-tool-card')[i].style.height = 'auto'
    })
    document.querySelector('#card_1_tool').style.height = "250px"
    document.querySelector('#card_1_tool').style.transition = "0.4s"
  }

  expandOnCard2Click(e){
    document.querySelectorAll('.col-4-card-content').forEach((d, i) => {
      document.querySelectorAll('.col-4-card-content')[i].style.display = "none";
    })
    document.querySelector("#card_2").style.display = "block";
    document.querySelectorAll('.col-4-tool-card').forEach((d,i) => {
      document.querySelectorAll('.col-4-tool-card')[i].style.height = 'auto'
    })
    document.querySelector('#card_2_tool').style.height = "250px"
    document.querySelector('#card_2_tool').style.transition = "0.4s"
  }

  expandOnCard3Click(e) {
    document.querySelectorAll('.col-4-card-content').forEach((d, i) => {
      document.querySelectorAll('.col-4-card-content')[i].style.display = "none";
    })
    document.querySelector("#card_3").style.display = "block";
    document.querySelectorAll('.col-4-tool-card').forEach((d,i) => {
      document.querySelectorAll('.col-4-tool-card')[i].style.height = 'auto'
    })
    document.querySelector('#card_3_tool').style.height = "250px"
    document.querySelector('#card_3_tool').style.transition = "0.4s"
  }

  renderCol16(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data,
        drug_data = this.state.drug_data,
        selectedOption = this.state.selectedOption,
        card_1 = this.state.dataJSON.card_data.data.card_1,
        card_2 = this.state.dataJSON.card_data.data.card_2,
        card_3 = this.state.dataJSON.card_data.data.card_3,
        card_4 = this.state.dataJSON.card_data.data.card_4;
      console.log(drug_data, "drug data")
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
              <div className="tool-call-to-action-button" onClick={(e) => this.getHealthFacilities(card_1)}>
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
              <div className="tool-call-to-action-button" onClick={(e) => this.getPharmacies(card_2)}>
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
            <div className="drug-name-dropdown">
              <Select 
                name="drug_name"
                placeholder="Drug Name" 
                value={selectedOption['drug_name'] && selectedOption['drug_name'].value}
                onChange={(d)=>this.handleSelectOption(d,"drug_name")} 
                options={drug_data.drugs.map((d)=>{
                  let temp = {};
                  temp.label = d.name;
                  temp.value = d.name;
                  return temp;
                })}
              />
            </div>
            <input type="text" name="dose" className="dose-input" placeholder="No. of dose" />
            <input type="text" name="price" className="price-input" placeholder="Buying price" />
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button" onClick={(e) => this.getMedicinePrices(card_3)}>
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
          <Modal
            showModal={this.state.showModal}
            closeModal={this.closeModal}
            mode={this.state.mode}
            dataJSON={data}
            responseData={this.state.responseData}
            cardType={this.state.card_type}
            title={this.state.title}
            buying_price={this.state.buying_price}
          />
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
       let data = this.state.dataJSON.card_data.data,
        drug_data = this.state.drug_data,
        selectedOption = this.state.selectedOption,
        card_1 = this.state.dataJSON.card_data.data.card_1,
        card_2 = this.state.dataJSON.card_data.data.card_2,
        card_3 = this.state.dataJSON.card_data.data.card_3,
        card_4 = this.state.dataJSON.card_data.data.card_4;
      console.log(drug_data, "drug data")
      return(
        <div className="col-4-tool-strip col-4-mobile">
          <div id="card_1_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard1Click(e)}>
            <div className="tool-card-title">
              <img src="img/facilities-icon.png" />
              {card_1.title}
              <img src="img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <div id="card_1" className="col-4-card-content">
              <p>Find the nearest health facilities around you</p>
              <input type="text" name="area" className="area-input" placeholder="Start typing the name of your area" />
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" onClick={(e) => this.getHealthFacilities(card_1)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div id="card_2_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard2Click(e)}>
            <div className="tool-card-title">
              <img src="img/pharmacies-icon.png" />
              {card_2.title}
              <img src="img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <div id="card_2" className="col-4-card-content">
              <p>Find pharmacies</p>
              <input type="text" name="location" className="location-input" placeholder="Search by location" />
              <input type="text" name="pharmacie-name" className="pharmacie-name-input" placeholder="Search by pharmacie name" />
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" onClick={(e) => this.getPharmacies(card_2)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div id="card_3_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard3Click(e)}>
            <div className="tool-card-title">
              <img src="img/meds-icon.png" />
              {card_3.title}
              <img src="img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <div id="card_3" className="col-4-card-content">
              <p>How much do you pay for drugs?</p>
              <div className="drug-name-dropdown">
                <Select 
                  name="drug_name"
                  placeholder="Drug Name" 
                  value={selectedOption['drug_name'] && selectedOption['drug_name'].value}
                  onChange={(d)=>this.handleSelectOption(d,"drug_name")} 
                  options={drug_data.drugs.map((d)=>{
                    let temp = {};
                    temp.label = d.name;
                    temp.value = d.name;
                    return temp;
                  })}
                />
              </div>
              <input type="text" name="dose" className="dose-input" placeholder="No. of dose" />
              <input type="text" name="price" className="price-input" placeholder="Buying price" />
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" onClick={(e) => this.getMedicinePrices(card_3)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title">
              <img src="img/eshangazi-icon.png" />
              {card_4.title}
            </div>
            <div className="tool-call-to-action-area-talk">
              <a href={card_4.url} target="_blank"><div className="tool-call-to-action-button-talk">
                Talk
              </div></a>
            </div>
          </div>
          <Modal
            showModal={this.state.showModal}
            closeModal={this.closeModal}
            mode={this.state.mode}
            dataJSON={data}
            responseData={this.state.responseData}
            cardType={this.state.card_type}
            title={this.state.title}
            buying_price={this.state.buying_price}
          />
        </div>
      )      
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

// <input type="text" name="drug-name" className="drug-name-input" placeholder="Drug Name" />