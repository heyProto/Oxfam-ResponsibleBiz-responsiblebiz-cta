import React from 'react';
import ReactDOM from 'react-dom';
import { all as axiosAll, get as axiosGet, spread as axiosSpread} from 'axios';
import Modal from "./Modal.js";
import Select from 'react-select';

export default class toHealthCard extends React.Component {
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
      card_type: '',
      status: 'close'
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
    if (this.props.drug_data) {
      stateVar.drug_data = this.props.drug_data;
    }
    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];
      axiosAll(items_to_fetch).then(axiosSpread((card) => {
        axiosGet(card.data.data.card_3.listing_drugs_api).then((response) => {
          // console.log(card, "card", response)
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
    // console.log(selectedOption, "newSelection")
    this.setState({
      selectedOption: selectedOption 
    });   
  }

  getHealthFacilities(data){
    let value = document.querySelector('.area-input').value;
    if (value !== ''){
      let api = data.api;      
      axios.get(api +"?q="+ value).then((response_data) => {
        // console.log(response_data)
        this.setState({
          responseData: response_data.data.facilities,
          card_type: "health_facilities",
          title: data.title
        })
        this.showModal();
      })
    }
  }

  getPharmacies(data){
    let location = document.querySelector('.location-input').value,
      name = document.querySelector('.pharmacie-name-input').value;

    if (location !== '' || name !== ''){
      let search_by, value;
      if (location === ''){
        search_by = 'name';
        value = document.querySelector('.pharmacie-name-input').value;
      }
      if (name === ''){
        search_by = 'location';
        value = document.querySelector('.location-input').value;
      }

      axios.get(data.api + "?search_by=" +search_by+ "&value=" +value).then((response_data) => {
        this.setState({
          responseData: response_data.data.pharmacies,
          card_type: "pharmacies",
          title: data.title
        })
        this.showModal();
      })
    }
  }

  getMedicinePrices(data){
    let drug_name = this.state.selectedOption.drug_name,
      dose = document.querySelector('.dose-input').value,
      buying_price = document.querySelector('.price-input').value;
    if (drug_name !== undefined && dose !== '' && buying_price !== '') {
      let drug_listing = data.listing_drugs_api,
        drug_price = data.drug_price_api,     
        api = drug_price +"?drug_id="+drug_name.drug_id+"&dose="+dose+"&buying_price="+buying_price;

      axios.get(api).then((response_data) => {
        console.log(response_data)
        this.setState({
          responseData: response_data.data,
          card_type: "medicine_prices",
          title: data.title,
          buying_price: buying_price
        })
        this.showModal();
      })
    }
  }

  onClickFirstExpand(e){
    let status;
    if (this.state.status === 'close'){
      status = 'open';
      document.querySelector(".col-16-tool-strip").style.height = "250px"
      document.querySelectorAll(".verticle-divider").forEach((d, i) => {
        document.querySelectorAll(".verticle-divider")[i].style.height = "250px"
      }) 
      if(typeof this.props.clickCallback === 'function') {
        this.props.selector.style.height = "250px"
        this.props.clickCallback();
      }  
    } else {
      status = 'close'
      document.querySelector(".col-16-tool-strip").style.height = "70px"
      document.querySelectorAll(".verticle-divider").forEach((d, i) => {
        document.querySelectorAll(".verticle-divider")[i].style.height = "50px"
      }) 
      if(typeof this.props.clickCallback === 'function') {
        this.props.selector.style.height = "70px"
        this.props.clickCallback();
      }  
    }
    this.setState({
      status: status
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
    document.querySelector('#card_1_tool').style.transition = "0.4s"
    document.querySelector('#card_1_tool').style.height = "250px"
    if(typeof this.props.clickCallback === 'function') {
      this.props.clickCallback();
    }
  }

  expandOnCard2Click(e){
    document.querySelectorAll('.col-4-card-content').forEach((d, i) => {
      document.querySelectorAll('.col-4-card-content')[i].style.display = "none";
    })
    document.querySelector("#card_2").style.display = "block";
    document.querySelectorAll('.col-4-tool-card').forEach((d,i) => {
      document.querySelectorAll('.col-4-tool-card')[i].style.height = 'auto'
    })
    document.querySelector('#card_2_tool').style.transition = "0.4s"
    document.querySelector('#card_2_tool').style.height = "250px"
    if(typeof this.props.clickCallback === 'function') {
      this.props.clickCallback();
    }
  }

  expandOnCard3Click(e) {
    document.querySelectorAll('.col-4-card-content').forEach((d, i) => {
      document.querySelectorAll('.col-4-card-content')[i].style.display = "none";
    })
    document.querySelector("#card_3").style.display = "block";
    document.querySelectorAll('.col-4-tool-card').forEach((d,i) => {
      document.querySelectorAll('.col-4-tool-card')[i].style.height = 'auto'
    })
    document.querySelector('#card_3_tool').style.transition = "0.4s"
    document.querySelector('#card_3_tool').style.height = "250px"
    if(typeof this.props.clickCallback === 'function') {
      this.props.clickCallback();
    }
  }

  onChangeLocation(){
    let val = document.querySelector('.location-input').value
    if (val !== ''){
      document.querySelector('.pharmacie-name-input').disabled = true;
    } else {
      document.querySelector('.pharmacie-name-input').disabled = false;
    }
  }

  onChangeName(){
    let val = document.querySelector('.pharmacie-name-input').value
    if (val !== ''){
      document.querySelector('.location-input').disabled = true;
    } else {
      document.querySelector('.location-input').disabled = false;
    }
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
        card_1 = data.card_1,
        card_2 = data.card_2,
        card_3 = data.card_3,
        card_4 = data.card_4,
        background_color = data.configuration.card_background_color,
        text_color = data.configuration.text_color;
      // console.log(this.state, drug_data, "drug data")
      return(
        <div className="col-16-tool-strip" style={{background: background_color}}>
          <div className="col-4-tool-card">
            <div className="tool-card-title" style={{color: text_color}} onClick={(e) => this.onClickFirstExpand(e)}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/facilities-icon.png" />
              {card_1.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <p className="tool-card-subtitle" style={{color: text_color}}>Find the nearest health facilities around you</p>
            <input type="text" name="area" className="area-input" placeholder="Start typing the name of your area" style={{color: text_color}}/>
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getHealthFacilities(card_1)}>
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title" style={{color: text_color}} onClick={(e) => this.onClickFirstExpand(e)}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/pharmacies-icon.png" />
              {card_2.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <p className="tool-card-subtitle" style={{color: text_color}}>Find pharmacies</p>
            <input type="text" name="location" className="location-input" placeholder="Search by location" onChange={(e) => this.onChangeLocation()} style={{color: text_color}}/>
            <input type="text" name="pharmacie-name" className="pharmacie-name-input" placeholder="Search by pharmacie name" onChange={(e) => this.onChangeName()} style={{color: text_color}}/>
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getPharmacies(card_2)}>
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title" style={{color: text_color}} onClick={(e) => this.onClickFirstExpand(e)}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/meds-icon.png" />
              {card_3.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <p className="tool-card-subtitle" style={{color: text_color}}>How much do you pay for drugs?</p>
            <div className="drug-name-dropdown">
              <Select 
                name="drug_name"
                placeholder="Drug Name" 
                value={selectedOption['drug_name'] && selectedOption['drug_name'].value}
                onChange={(d)=>this.handleSelectOption(d,"drug_name")} 
                options={drug_data.drugs.map((d, i)=>{
                  let temp = {};
                  temp.label = d.name;
                  temp.value = d.name;
                  temp.drug_id = i;
                  return temp;
                })}
              />
            </div>
            <input type="text" name="dose" className="dose-input" placeholder="No. of dose" style={{color: text_color}}/>
            <input type="text" name="price" className="price-input" placeholder="Buying price" style={{color: text_color}} />
            <div className="tool-call-to-action-area">
              <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getMedicinePrices(card_3)}>
                Search
              </div>
            </div>
          </div>
          <div className="verticle-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title" style={{color: text_color}} onClick={(e) => this.onClickFirstExpand(e)}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/eshangazi-icon.png" />
              {card_4.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <div className="e-shangazi-image-area">
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/bwanaafya-logo.png" width="112px"/>
            </div>
            <div className="tool-call-to-action-area">
              <a href={card_4.url} target="_blank"><div className="tool-call-to-action-button" style={{background: text_color, color: background_color}}>
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
            clickCallback={this.props.clickCallback}
            selector={this.props.selector}
            background_color={background_color}
            text_color={text_color}
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
        card_1 = data.card_1,
        card_2 = data.card_2,
        card_3 = data.card_3,
        card_4 = data.card_4,
        background_color = data.configuration.card_background_color,
        text_color = data.configuration.text_color;
      return(
        <div className="col-4-tool-strip col-4-mobile" style={{background: background_color}}>
          <div id="card_1_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard1Click(e)}>
            <div className="tool-card-title" style={{color: text_color}}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/facilities-icon.png" />
              {card_1.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon"/>
            </div>
            <div id="card_1" className="col-4-card-content">
              <p className="tool-card-subtitle" style={{color: text_color}}>Find the nearest health facilities around you</p>
              <input type="text" name="area" className="area-input" placeholder="Start typing the name of your area" style={{color: text_color}}/>
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getHealthFacilities(card_1)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div id="card_2_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard2Click(e)}>
            <div className="tool-card-title" style={{color: text_color}}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/pharmacies-icon.png" />
              {card_2.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <div id="card_2" className="col-4-card-content">
              <p className="tool-card-subtitle" style={{color: text_color}}>Find pharmacies</p>
              <input type="text" name="location" className="location-input" placeholder="Search by location" onChange={(e) => this.onChangeLocation()} style={{color: text_color}}/>
              <input type="text" name="pharmacie-name" className="pharmacie-name-input" placeholder="Search by pharmacie name" onChange={(e) => this.onChangeName()} style={{color: text_color}}/>
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getPharmacies(card_2)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div id="card_3_tool" className="col-4-tool-card" onClick={(e) => this.expandOnCard3Click(e)}>
            <div className="tool-card-title" style={{color: text_color}}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/meds-icon.png" />
              {card_3.title}
              <img src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/down-arrow.png" className="down-arrow-icon" />
            </div>
            <div id="card_3" className="col-4-card-content">
              <p className="tool-card-subtitle" style={{color: text_color}}>How much do you pay for drugs?</p>
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
              <input type="text" name="dose" className="dose-input" placeholder="No. of dose" style={{color: text_color}} />
              <input type="text" name="price" className="price-input" placeholder="Buying price" style={{color: text_color}}/>
              <div className="tool-call-to-action-area">
                <div className="tool-call-to-action-button" style={{background: text_color, color: background_color}} onClick={(e) => this.getMedicinePrices(card_3)}>
                  Search
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div className="col-4-tool-card">
            <div className="tool-card-title" style={{color: text_color}}>
              <img className="tool-card-img" src="https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/eshangazi-icon.png" />
              {card_4.title}
            </div>
            <div className="tool-call-to-action-area-talk">
              <a href={card_4.url} target="_blank"><div className="tool-call-to-action-button-talk" style={{background: text_color, color: background_color}}>
                Talk
              </div></a>
            </div>
          </div>
          <Modal
            showModal={this.state.showModal}
            closeModal={this.closeModal}
            mode={this.props.mode}
            dataJSON={data}
            responseData={this.state.responseData}
            cardType={this.state.card_type}
            title={this.state.title}
            buying_price={this.state.buying_price}
            clickCallback={this.props.clickCallback}
            selector={this.props.selector}
            background_color={background_color}
            text_color={text_color}
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