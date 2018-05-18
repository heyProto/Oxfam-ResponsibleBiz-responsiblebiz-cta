import React from 'react';
import ReactDOM from 'react-dom';
import HealthCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.proC4Ahealthtools = function () {
  this.cardType = 'proC4Ahealthtools';
}

ProtoGraph.Card.proC4Ahealthtools.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.proC4Ahealthtools.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.proC4Ahealthtools.prototype.renderCol16= function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.proC4Ahealthtools.prototype.renderCol4= function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.proC4Ahealthtools.prototype.render = function () {
  ReactDOM.render(
    <HealthCard
      dataURL={this.options.data_url}
      selector={this.options.selector}
      clickCallback={this.options.onClickCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}