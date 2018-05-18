import React from 'react';
import ReactModal from 'react-modal';

class Modal extends React.Component {

  constructor () {
    super();
    this.afterOpen = this.afterOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  afterOpen() {
    console.log("after open")
    document.body.style['overflow-y'] = 'hidden';
  }

  handleRequestClose() {
    console.log("close")
    document.body.style['overflow-y'] = 'auto';
  }

  render() {
    let modal_content;
    if (this.props.responseData === undefined){
      modal_content = ''
    } else {
      let data = this.props.responseData;
      modal_content = data.facilities.map((d,i) => {
        return(
          <div className="modal-single-content">
            <div className="modal-name">{d.facility_name}</div>
            <div className="modal-content-left">
              <div>
                <div className="modal-title">Region</div>
                <div className="modal-value">{d.region}</div>
              </div>
              <div>
                <div className="modal-title">District</div>
                <div className="modal-value">{d.district}</div>
              </div>
              <div>
                <div className="modal-title">Ward</div>
                <div className="modal-value">{d.ward}</div>
              </div>
               <div>
                <div className="modal-title">Village</div>
                <div className="modal-value">{d.village}</div>
              </div>
            </div>
            <div className="modal-content-right">
              <div>
                <div className="modal-title">Type</div>
                <div className="modal-value">{d.facility_type}</div>
              </div>
              <div>
                <div className="modal-title">Status</div>
                <div className="modal-value">{d.status}</div>
              </div>
              <div>
                <div className="modal-title">Ownership</div>
                <div className="modal-value">{d.ownership}</div>
              </div>
              <div>
                <div className="modal-title">NHIF accreditaion number</div>
                <div className="modal-value">{d.nhif_accreditation_no}</div>
              </div>
            </div>
          </div>
        )
    })
    } 
    return(
      <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className="proto-col col-7 protograph-modal"
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={false}
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
          onClick={((e) => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          })}
        >
          <div className="protograph-close-text">x</div>
        </div>
        <div id="protograph_modal_card">
          <div className="modal-card-title">
            <img src="img/facilities-icon.png" style={{backgroundColor: 'black'}}/>Health facilities near me
          </div>
          <div className="protograph-modal-content">{modal_content}</div>
        </div>
      </ReactModal>
    )
  }
}

export default Modal;