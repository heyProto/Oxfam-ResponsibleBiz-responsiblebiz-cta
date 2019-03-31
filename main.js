import React from 'react';
import ReactDOM from 'react-dom';
import HealthCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toOxfamCTA = function () {
  this.cardType = 'toOxfamCTA';
}

ProtoGraph.Card.toOxfamCTA.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toOxfamCTA.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toOxfamCTA.prototype.renderCol16= function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.toOxfamCTA.prototype.renderCol4= function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.toOxfamCTA.prototype.render = function () {
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