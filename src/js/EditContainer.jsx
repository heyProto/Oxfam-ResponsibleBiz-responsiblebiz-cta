import React from 'react';
import ReactDOM from 'react-dom';
import {all as axiosAll, get as axiosGet, spread as axiosSpread} from 'axios';
import HealthCard from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class toOxfamCTAEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      mode: "col16",
      loading: true,
      publishing: false,
      uiSchemaJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let data = this.state.dataJSON;
    let getDataObj = {
      step: this.state.step,
      dataJSON: data.card_data,
      schemaJSON: this.state.schemaJSON,
      uiSchemaJSON: this.state.uiSchemaJSON,
      optionalConfigJSON: this.state.dataJSON.configs,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = "Health Card"; // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    if (typeof this.props.dataURL === "string"){
      axios.all([
        axiosGet(this.props.dataURL),
        axiosGet(this.props.schemaURL),
        axiosGet(this.props.optionalConfigURL),
        axiosGet(this.props.optionalConfigSchemaURL),
        axiosGet(this.props.uiSchemaURL)
      ]).then(axiosSpread((card, schema, opt_config, opt_config_schema, uiSchema) => {
          axios.get(card.data.data.card_3.listing_drugs_api).then((response) => {
            // console.log(card, "card", response)
            let stateVar = {
              dataJSON: {
                card_data: card.data,
                configs: opt_config.data
              },
              drug_data: response.data,
              schemaJSON: schema.data,
              uiSchemaJSON: uiSchema.data,
              optionalConfigJSON: opt_config.data,
              optionalConfigSchemaJSON: opt_config_schema.data
            }
            this.setState(stateVar);
          })
        }))
        .catch((error) => {
          console.error(error);
          this.setState({
            errorOnFetchingData: true
          })
        });
    }
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.card_data = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        if (typeof this.props.onPublishCallback === "function") {
          this.setState({ publishing: true });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  renderSEO() {
    let data = this.state.dataJSON.card_data.data,
      seo_blockquote;
    seo_blockquote = ''
    return seo_blockquote;
  }


  renderSchemaJSON() {
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON;
        break;
      case 2:
        return this.state.optionalConfigSchemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.card_data;
        break;
      case 2:
        return this.state.dataJSON.configs;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      return {
        mode: "blank"
      }
    }, (() => {
        this.setState((prevState, props) => {
          let newMode;
          if (mode !== prevState.mode) {
            newMode = mode;
          } else {
            newMode = prevState.mode
          }
          return {
            mode: newMode
          }
        })
      }))
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      // console.log(this.state.drug_data, "drugs")
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                  toOxfamCTAEdit
                  </div>
                </div>
                <JSONSchemaForm
                  uiSchema={this.state.uiSchemaJSON}
                  schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  formData={this.renderFormData()}
                  >
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col16' ? 'active' : ''}`}
                      data-mode='col16'
                      onClick={this.toggleMode}
                    >
                      col16
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col4
                    </a>
                  </div>
                </div>
                {
                  this.state.mode == "blank" ? <div /> : <div className="protograph-app-holder">
                    <HealthCard
                      mode={this.state.mode}
                      dataJSON={this.state.dataJSON}
                      domain={this.props.domain}
                      drug_data={this.state.drug_data}
                      optionalConfigJSON={this.state.optionalConfigJSON}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}