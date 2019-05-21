import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread} from 'axios';

export default class toOxfamCTACard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      }
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }
    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];
      axiosAll(items_to_fetch).then(axiosSpread((card) => {
          // console.log(card, "card", response)
          let stateVar = {
            fetchingData: false,
            dataJSON: {
              card_data: card.data
            },
            optionalConfigJSON: {}
          };
          this.setState(stateVar);
          })
      );
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

  renderCol16(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data
      return(
        <div className="col-16-tool-strip">
          <a className="c2a-button-col16" href={data.buttons[0].url} target="_blank"><i className="icon-images far fa-chart-bar"></i>{data.buttons[0].text}</a>
          <a className="c2a-button-col16" href={data.buttons[1].url} style={{marginLeft: 0}} target="_blank"><i className="icon-images far fa-envelope"></i>{data.buttons[1].text}</a>
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
      let data = this.state.dataJSON.card_data.data
      return(
        <div className="col-4-tool-strip col-4-mobile">
          <a className="c2a-button-col4" href={data.buttons[0].url} target="_blank"><i className="icon-images far fa-chart-bar"></i>{data.buttons[0].text}</a>
          <a className="c2a-button-col4" style={{marginTop: 0}} href={data.buttons[1].url} target="_blank"><i className="icon-images far fa-envelope"></i>{data.buttons[1].text}</a>
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