import React, { Component } from 'react';
import logo from './logo.svg';
import './matrix.css';

class MatrixVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headPart: [],
      rules:[]
    };
    this.createColumns = this.createColumns.bind(this);
    this.createContent = this.createContent.bind(this);
  }
  componentDidUpdate(prevProps) {
    // if ( this.props.columns !== prevProps.columns ) {
    //   this.createColumns();
    // }
  }

  createColumns(){
    var columns = this.props.columns;
    return columns.map(column => {
      return <div className="cell"><div className="column_text">{column}</div></div>
    })
  }

  createContent(){

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.createColumns()}
        </div>
        <div className="row">xxxx</div>
      </div>
    );
  }

}

export default MatrixVisualization;
