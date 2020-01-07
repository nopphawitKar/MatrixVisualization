import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Select from 'react-select';
import MakeAnimated from 'react-select/animated';

const CHOICE_ANY = "any...";
const EQUAL = "=";
class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attrs: [],//[{value: "workclass", label: "workclass"},{value: "education", label: "education"}]
      selectedAttrs:[],//["education"]
      selectedValue: {},
      selectedAttrCount: 0,
      rulesNum:0
    };
    this.log = this.log.bind(this);
    this.getAttrs = this.getAttrs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.getValues = this.getValues.bind(this);
    this.buildChoice = this.buildChoice.bind(this);
    this.getRuleResultsDom = this.getRuleResultsDom.bind(this);
    this.filterByAttrs = this.filterByAttrs.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.head !== prevProps.head) {
      this.getAttrs();
    }
  }

  getAttrs(){
    var choices = [];
    var head = this.props.head;
    // console.log(head);
    for(var i=0;i<head.length;i++){
      var choice = {};
      choice.value = head[i].title;
      choice.label = head[i].title;
      choices.push(choice);
    }
    this.setState({attrs: choices})
  }

  addFilter(){
    // [{ value: 'chocolate', label: 'Chocolate' },{ value: 'strawberry', label: 'Strawberry' },{ value: 'vanilla', label: 'Vanilla' }]
    return this.state.selectedAttrs.map(item => {
      item = item.split(EQUAL)[0];
      var choices = this.getValues(item);
      choices.push(CHOICE_ANY);
      var options = this.buildChoice(item ,choices);
      return (
        <Select id={item} className="filter_select" options={options} defaultValue={{ value: CHOICE_ANY, label: CHOICE_ANY }} onChange={this.handleChange}/>
      )
    });
  }



  buildChoice(selectName, choicesArrayForm){
    // var choices = [];
    var choicesSelectForm = [];
    for(var i=0;i<choicesArrayForm.length;i++){
      var choice = {};
      choice.value = selectName + "=" + choicesArrayForm[i];
      choice.label = choicesArrayForm[i];
      choicesSelectForm.push(choice);
    }
    return choicesSelectForm;
  }
  getValues(attr){
    for(var i=0;i<this.props.head.length;i++){
      if(this.props.head[i].title == attr){
        return this.props.head[i].choice;
      }
    }
    return null;
  }

  eventDeleteAttr(attrs){
    // var attrs = e;
    var lastAttr = attrs[attrs.length-1].value;
    //if delete an attr
    var state_selectedAttrs = this.state.selectedAttrs;

    var state_attrs = [];
    var event_attrs= [];
    attrs.forEach(attr => event_attrs.push(attr.value));
    state_selectedAttrs.forEach(attr => state_attrs.push(attr.split(EQUAL)[0]))

    var removedIndex = state_attrs.findIndex(attr => !event_attrs.contain(attr));
    state_selectedAttrs.splice(removedIndex);
    this.setState({selectedAttrs: state_selectedAttrs});

  }
  //handle change on all selects
  handleChange(e){
      if(e == null){
        e = [];
      }
      var isAttrsSelect = (Array.isArray(e));

      //condition: add or delete an attribute
      if(isAttrsSelect){

        var attrs = e;

        //if delete an attr
        var state_selectedAttrs = this.state.selectedAttrs;
        if(attrs.length < state_selectedAttrs.length){
          //delete an attr
          var state_attrs = [];
          var event_attrs= [];
          attrs.forEach(attr => event_attrs.push(attr.value));
          state_selectedAttrs.forEach(attr => state_attrs.push(attr.split(EQUAL)[0]))

          var removedIndex = state_attrs.findIndex(attr => !event_attrs.includes(attr));
          state_selectedAttrs.splice(removedIndex);
          this.setState({selectedAttrs: state_selectedAttrs});
        }else{
          //add an attr
          var lastAttr = attrs[attrs.length-1].value;
          var selectedAttrs = this.state.selectedAttrs;//[];
          var currentSelect = document.getElementById(lastAttr);
          selectedAttrs.push(lastAttr);
          this.setState({selectedAttrs: selectedAttrs});
        }
      }else{//condition: change attr value
        var selectedValue = e.value;//education=HS
        var selectedAttr = selectedValue.split(EQUAL)[0];
        var selectedAttrs = this.state.selectedAttrs;
        for(var i=0;i<selectedAttrs.length;i++){
          var indexAttr = selectedAttrs[i].split(EQUAL)[0];
          if(selectedAttr == indexAttr){
            selectedAttrs[i] = selectedValue;
            this.setState({selectedAttrs: selectedAttrs});
            return;
          }
        }
      }



  }

  log(message){
    console.log(message)
  }

  //work when attrs multi-select is used
  filterByAttrs(){
    var selectedAttributes = this.state.selectedAttrs;
    var count = 0;
    var filteredRules = [];

    for(var i=0;i<this.props.rules.length;i++){
      count = 0;
      for(var j=0;j<selectedAttributes.length;j++){
        var LHS = this.props.rules[i].LHS;
        var RHS = this.props.rules[i].RHS;
        var selectedAttribute = selectedAttributes[j];
        if(LHS.toString().includes(selectedAttribute) ||
        RHS.toString().includes(selectedAttribute) ){
          count++;
        }
      }
      if(count==selectedAttributes.length){
        filteredRules.push(this.props.rules[i])
      }
    }

    return filteredRules;
  }
  getRuleResultsDom(){
    var rules = this.filterByAttrs();//this.props.rules;
    // this.setState({rulesNum: rules.length})
    var rules_string_form = [];

    var tempLHS = "";
    var tempRHS = "";
    var fullRule = "";
    const THEN = "=>";

    return rules.map(rule => {
        var clonedLHS = Object.assign([], rule.LHS);
        var clonedRHS = Object.assign([], rule.RHS);

        clonedLHS.pop();
        clonedRHS.pop();

        tempLHS = "{" + clonedLHS + "}";
        tempRHS = "{" + clonedRHS + "}";
        tempLHS = tempLHS.replace(/,/g,',     ');
        tempRHS = tempRHS.replace(/,/g,',     ');

        fullRule = tempLHS + THEN + tempRHS;
        return <div>{fullRule}</div>;
        // rules_string_form.push(fullRule);
    });

    console.log(rules_string_form);
  }


  render() {
    return (
      <div className="">
        {this.log()}
        <div className="container">
          <div className="head_container">
          </div>
          <div className="body_container">
            <Select isMulti id="Main_Select" options={this.state.attrs} onChange={this.handleChange}/>
            {this.addFilter()}
            <div className="rules_container">
              {this.getRuleResultsDom().length}
            {this.getRuleResultsDom()}
            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default Visualization;
