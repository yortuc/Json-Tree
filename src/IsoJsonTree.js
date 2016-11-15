import React, {Component} from 'react';



/*
*
*/
var rules = [
  (name, value)=> typeof value === "function" ? <EditorFunc name={name} value={value} /> : null,
  (name, value)=> typeof value === "string" && !isNaN(Date.parse(value)) ? <EditorDate name={name} value={value}/> : null,
  (name, value)=> typeof value === "string" && (value.indexOf("http://") === 0 ||  
           value.indexOf("https://") === 0 ||
           value.indexOf("www.") === 0) ? <EditorLink name={name} value={value} /> : null,          
  (name, value)=> typeof value === "string" ? <EditorString name={name} value={value}/> : null,
  (name, value)=> typeof value === "number" ? <EditorNumeric name={name} value={value}/> : null,
  (name, value)=> typeof value === "boolean" ? <EditorBoolean name={name} value={value}/> : null,
  (name, value)=> typeof value === "object" && !Array.isArray(value) && typeof value[Symbol.iterator] === 'function' ?
  					<EditorArray value={Array.from(value)} name={name + "[iterable]"}/>: null,
  (name, value)=> typeof value === "object" && Array.isArray(value) ? <EditorArray value={value} name={name + " ["+value.length+"]"}/> : null,
  (name, value)=> typeof value === "object" ? <EditorObject value={value} name={name + " {"+ Object.keys(value).length +"}"}/> : null
];


class JsonTree extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
    rules = Array.prototype.concat(this.props.rules || [] , rules);
  }

  render() {
    return (
      <div className="JsonTree-Tree">
        <KeyValue name={this.props.title || ""} value={this.props.json} />
      </div>)
  }
}

class KeyValue extends Component {
  render() {
    var ret;

    for(var i=0; i<rules.length; i++){
      let processed = rules[i](this.props.name, this.props.value);
      if(processed) {
        ret = processed;
        break;
      }
    }

    return ret;
  }
}

class Collapsable extends Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: false};
  }

  toggle() {
  	this.setState({ collapsed: !this.state.collapsed })
  } 
  
  render() {
    return(
       <div className="JsonTree-Node-Item">
        <div className="JsonTree-Node-Key">
          <a href="#" onClick={this.toggle.bind(this)} className={"Collapsable-Arrow" + (this.state.collapsed ? "" : " Open")}>▼</a>
          <span>{this.props.title}</span>
        </div>
        <div className={ "JsonTree-Node-Value child-element" + (this.state.collapsed ? " hidden" : "") }>
          {this.props.children}
        </div>
      </div>
    ) 
  }
}

class EditorString extends Component {
  getLabel() {
  	return <span className="JsonTree-Node-Value-String">{"\"" + this.props.value + "\""}</span>
  } 

  render() {
    return  <div className="JsonTree-Node-Item">
              <div className="JsonTree-Node-Key">{this.props.name} : </div>
              <div className="JsonTree-Node-Value">{this.getLabel()}</div>
            </div>;
  }
}

class EditorLink extends EditorString {
  getLabel() {
  	return <span className="JsonTree-Node-Value-String">
		      "<a href={this.props.value} target="_blank">{this.props.value}</a>"
		   </span>
  } 

}

class EditorNumeric extends EditorString {
  getLabel(){
  	return <span className="JsonTree-Node-Value-Number">{this.props.value}</span>
  }
}

class EditorBoolean extends EditorString {
  getLabel() {
  	return <span className="JsonTree-Node-Value-Number">{JSON.stringify(this.props.value)}</span>
  }
}

class EditorDate extends EditorString {
  formatDate(strDate) {
    const today = new Date(strDate);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy; 
  } 

  getLabel() {
  	return <span className="JsonTree-Node-Value-Number">{this.formatDate(this.props.value)}</span>
  }
}

class EditorArray extends EditorString {
  render(){
  	return <Collapsable title={this.props.name}>
             {this.props.value.map((item, index)=>
               <KeyValue name={index} value={item} />
             )}
           </Collapsable>
  }
}

class EditorObject extends EditorString {
  render(){
  	return <Collapsable title={this.props.name}>
	          {Object.keys(this.props.value).map((item)=> 
	            <KeyValue name={item} value={this.props.value[item]} />
	          )}
	        </Collapsable>
  } 
}

class EditorFunc extends EditorString {

  getParamNames() {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;

    var fnStr = this.props.value.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
       result = [];
    return result;
  }

  render(){
    let sourceCode = this.props.value.toString().split('\n');

    return <Collapsable title={this.props.value.name + "(" + this.getParamNames() + ")"}>
             <div className="JsonTree-Node-Item JsonTree-Node-Value-Func">
                {sourceCode.map((line)=> {
                  return <div className="JsonTree-Node-Value-Func-Line">
                            {line}
                         </div>
                })}
                
             </div>
          </Collapsable>
  } 
}


export default JsonTree;