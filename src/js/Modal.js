import React from 'react';
import ReactModal from 'react-modal';

class Modal extends React.Component {

  constructor () {
    super();
    this.afterOpen = this.afterOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  afterOpen() {
    document.body.style['overflow-y'] = 'hidden';
    if(typeof this.props.clickCallback === 'function') {
      this.props.selector.style.height = "500px";
      this.props.clickCallback();
    }
  }

  handleRequestClose() {
    console.log("close")
    document.querySelectorAll('.col-4-tool-card input').forEach((d, i) => {
      document.querySelectorAll('.col-4-tool-card input')[i].value = '';
    })
    document.querySelector('.pharmacie-name-input').disabled = false;
    document.querySelector('.location-input').disabled = false;
    document.body.style['overflow-y'] = 'auto';
    if(typeof this.props.clickCallback === 'function') {
      this.props.selector.style.height = "250px";
      this.props.clickCallback();
    }
  }

  render() {
    let classname;
    if (this.props.mode === 'col4'){
      classname = "column-4"
    } else {
      classname = "col-7"
    }
    let modal_content, background_color, text_color,
      image,
      title;
    console.log(this.props.responseData, "this.props.responseData")
    if (this.props.responseData === undefined){
      modal_content = ''
      title =''
      image=''
      background_color = ''
      text_color = ''
    } else {
      let data = this.props.responseData;
      background_color = this.props.background_color;
      text_color = this.props.text_color;
      title = this.props.title;
      if (this.props.cardType === 'health_facilities'){
        image = 'https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/facilities-icon-black.png';
        modal_content = data.map((d,i) => {
          return(          
            <div className="modal-list">
              <div className="single-search-result">
                <div className="single-search-result-title" style={{color: background_color}}>
                  {d.facility_name}
                </div>
                <div className="status-label">
                  {d.status}
                </div>
                <div className="single-search-result-values" >
                  <div className="half-width-parameter">
                    <div className="single-parameter">
                      <div className="parameter-label">Type</div>
                      <p>{d.facility_type}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Zone</div>
                      <p>{d.zone}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Region</div>
                      <p>{d.region}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">District</div>
                      <p>{d.district}</p>
                    </div>
                  </div>
                  <div className="half-width-parameter">
                    <div className="single-parameter">
                      <div className="parameter-label">Ownership</div>
                      <p>{d.ownership}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Council</div>
                      <p>{d.council}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Village</div>
                      <p>{d.village}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Ward</div>
                      <p>{d.ward}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          )
        })
      } else if (this.props.cardType === 'pharmacies'){
        image = 'https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/pharmacies-icon-black.png';
        modal_content = data.map((d, i) => {
          return(
            <div className="modal-list">
              <div className="single-search-result">
                <div className="single-search-result-title" style={{color: background_color}}>
                  {d.name}
                </div>
                <div className="single-search-result-values">
                  <div className="half-width-parameter">
                    <div className="single-parameter">
                      <div className="parameter-label">Location</div>
                      <p>{d.location}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Region</div>
                      <p>{d.region}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">District</div>
                      <p>{d.district}</p>
                    </div>
                  </div>
                  <div className="half-width-parameter">
                    <div className="single-parameter">
                      <div className="parameter-label">Type</div>
                      <p>{d.type}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Registration No.</div>
                      <p>{d.registration_number}</p>
                    </div>
                    <div className="single-parameter">
                      <div className="parameter-label">Registration Date</div>
                      <p>{d.registration_date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      } else if (this.props.cardType === 'medicine_prices'){
        let buying_price = this.props.buying_price;
        image = 'https://cdn.protograph.pykih.com/b011d28f52396081faa8/img/meds-icon-black.png';
        modal_content = [1].map((d, i) => {
          return(
            <div className="modal-list">
              <div className="single-search-result">
                <div className="single-search-result-title" style={{color: background_color}}>
                  You paid TZS {buying_price} <span className="above-price">- {data.price_check.buying_price_status} given price</span>
                </div>
                <div className="single-search-result-values">
                  <p className="single-search-result-values-para">{data.message}</p>
                    
                  <div className="med-details-label">Medicine details</div>

                  <div className="full-width-parameter">
                    <div className="single-parameter">
                      <div className="parameter-label">Name</div>
                      <p className="med-name">{data.drug.name}</p>
                    </div>
                  </div>
                  <div className="full-width-parameter">
                    <div className="single-parameter-inline">
                      <div className="parameter-label">Strength</div>
                      <p>{data.drug.strength}</p>
                    </div>
                    <div className="single-parameter-inline">
                      <div className="parameter-label">Form</div>
                      <p>{data.drug.form}</p>
                    </div>
                    <div className="single-parameter-inline">
                      <div className="parameter-label">Unit of measure</div>
                      <p>{data.drug.uom}</p>
                    </div>
                    <div className="single-parameter-inline">
                      <div className="parameter-label">Price</div>
                      <p>{data.drug.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    } 
    return(
      <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        onRequestClose={((e) => {
          this.handleRequestClose(e);
          this.props.closeModal(e);
        })}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className={`proto-col ${classname} protograph-modal`}
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={false}
        shouldReturnFocusAfterClose={true}
        role="dialog"
        parentSelector={() => document.body}
        aria={{
          labelledby: "heading",
          describedby: "full_description"
        }}
      >
        <div
          className="protograph-close-modal"
          style={{background: background_color, color: text_color}}
          onClick={((e) => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          })}
        >
          <div className="protograph-close-text">x</div>
        </div>
        <div id="protograph_modal_card">
           <div className="modal-card">
            <div className="modal-title">
              <img src={image} />
              <span>{this.props.title}</span>
            </div>
            {modal_content}
            </div>
        </div>
      </ReactModal>
    )
  }
}

export default Modal;