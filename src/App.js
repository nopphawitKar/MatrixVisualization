import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MatrixVisualization from './MatrixVisualization.js';
import Visualization from './Visualization.js';

var fileReader;

var visualizationObj = {headPart:[], rules:[]};
var content = "";
var head="";
var headLines = [];

var data="";
var dataLines=[];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headPart: [],
      rules:[],
      values:[]
    };

    this.toTransactionArray = this.toTransactionArray.bind(this);
    this.toDropdown = this.toDropdown.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.convertLineToRules = this.convertLineToRules.bind(this);
    this.rawToValue = this.rawToValue.bind(this);
    this.getAllColumn = this.getAllColumn.bind(this);
  }
  getAllColumn(){
    var allAttrs = this.state.headPart;
    var values = [];
    allAttrs.forEach(attr =>
      attr.choice.forEach(value =>
        values.push(value)
      )
    );
    this.setState({values: values})
    //[male,female,hs,grad,bach,master]
  }
  toTransactionArray(){
    const SEPERATER_NEWLINE = "\n";
    dataLines = data.split(SEPERATER_NEWLINE);
    this.convertLineToRules();
  }
  toDropdown(){
    const SEPERATER_NEWLINE = "\n";
    const SEPERATER_ATTRIBUTE = "@ATTRIBUTE";
    const SEPERATER_ฺBRACLET = "{";
    const SEPERATER_CLOSE_BRACLET = "}";
    const SEPERATER_COMMA = ",";
    headLines = head.trim().split(SEPERATER_NEWLINE);

    for(var i=0;i<headLines.length;i++){
      var temp;

      temp = headLines[i].replace(SEPERATER_ATTRIBUTE,"").trim();
      temp = temp.split(SEPERATER_ฺBRACLET);
      headLines[i] = {};
      headLines[i].title = temp[0].trim();


      temp[1] = temp[1].replace(SEPERATER_CLOSE_BRACLET, "").trim();
      var choices = [];
      temp[1] = temp[1].replace(/\s/g,'');
      choices = temp[1].split(SEPERATER_COMMA);
      headLines[i].choice = choices;
    }
    visualizationObj.headPart = headLines;
    this.setState({headPart: headLines});

    this.getAllColumn();
    /*headLines ==> [{title: "workclass", choice: Array(8)}, {title: "education", choice: Array(16)}]*/
  }
  convertLineToRules(){
    const SEPERATER_ARROW = "==>";
    const SEPERATER_ANGLE_BRACLET = "<";
    var rules = [];

    for(var i=0;i<dataLines.length;i++){
      var ruleObj = {};
      var rule = dataLines[i].split(SEPERATER_ARROW);

      // ruleObj.LHS = rule[0];
      ruleObj.LHS = rule[0].trim().split(" ");
      ruleObj.LHS.shift();

      var RHSandValue = rule[1].split(SEPERATER_ANGLE_BRACLET);

      ruleObj.RHS = RHSandValue[0].trim().split(" ");
      ruleObj.Values = {};//RHSandValue[1].trim().split(" ");
      var values = RHSandValue[1].trim().split(" ");
      var conf = this.rawToValue(values[0], "conf:(");
      ruleObj.Values.conf = conf;

      var lift = this.rawToValue(values[1], "lift:(");
      ruleObj.Values.lift = lift;

      var lev = this.rawToValue(values[2], "lev:(");
      ruleObj.Values.lev = lev;

      var conv = this.rawToValue(values[4], "conv:(");
      ruleObj.Values.conv = conv;

      rules.push(ruleObj);
    }
    visualizationObj.rules = rules;
    this.setState({rules: rules})
    // console.log(rules);
  }

  rawToValue(fullText ,title){
    var value = fullText.trim().replace(title,"");
    value = value.replace(")","");
    value = value.replace(">","");
    return value;
  }

  handleFileRead(){
    const SEPERATER_DATA = '@DATA';
    content = fileReader.result;

    //seperate content to header and data
    var res = content.split(SEPERATER_DATA);
    head = res[0];
    data = res[1];
    head = head.trim();
    data = data.trim();
    this.toDropdown();
    this.toTransactionArray();
  }
  readFile(file){
    fileReader = new FileReader();
    fileReader.onloadend = this.handleFileRead;
    fileReader.readAsText(file);
  }


  render() {
    return (
      <div className="App">

        <header className="App-header">
          <input type="file" id="file" accept=".arff" onChange={e => this.readFile(e.target.files[0])}/>
          <MatrixVisualization columns={this.state.values}></MatrixVisualization>
        </header>
      </div>
    );
  }

}

export default App;
