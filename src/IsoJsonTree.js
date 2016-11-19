import React, {Component} from 'react';

/*
 *  default rules for rendering basic types
 */
var rules = [
  /* null */
  (name, value)=> value === null ? <EditorString name={name} value={"null"} /> : null,

  /* function */
  (name, value)=> typeof value === "function" ? <EditorFunc name={name} value={value} /> : null,  

  /* iso date-time */
  (name, value)=> typeof value === "string" && !isNaN(Date.parse(value)) ? <EditorDate name={name} value={value}/> : null,  //
  
  /* url */
  (name, value)=> typeof value === "string" && (value.indexOf("http://") === 0 ||  
           value.indexOf("https://") === 0 ||
           value.indexOf("www.") === 0) ? <EditorLink name={name} value={value} /> : null,          
  
  /* string */
  (name, value)=> typeof value === "string" ? <EditorString name={name} value={value}/> : null,
  
  /* number */
  (name, value)=> typeof value === "number" ? <EditorNumeric name={name} value={value}/> : null,
  
  /* boolean */
  (name, value)=> typeof value === "boolean" ? <EditorBoolean name={name} value={value}/> : null,
  
  /* iterator */
  (name, value)=> typeof value === "object" && !Array.isArray(value) && typeof value[Symbol.iterator] === 'function' ?
  					<EditorArray value={Array.from(value)} name={name + "[iterable]"}/>: null,
  
  /* array */
  (name, value)=> typeof value === "object" && Array.isArray(value) ? <EditorArray value={value} name={name + " ["+value.length+"]"}/> : null,
  
  /* object */
  (name, value)=> typeof value === "object" ? <EditorObject value={value} name={name + " {"+ Object.keys(value).length +"}"}/> : null
];


/*
*   main tree
*/
class JsonTree extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};

    // merge rules with customs
    rules = Array.prototype.concat(this.props.rules || [] , rules);

    // check the parameter, if its json string or js object
    if (typeof this.props.data === "string") {
      try {
        let obj = JSON.parse(this.props.data);
        this._dataObject = obj;
      }
      catch(err) {
        throw "iso-json-tree data parse error. json string cannot be converted to object. " + err;
        this._dataObject = {};        
      }
    }
    else if(typeof this.props.data === "object"){
      this._dataObject = this.props.data;
    }
    else{
      throw "iso-json-tree data is not in the expected format. provided data = " + JSON.stringify(this.props.data);
    }
  }

  render() {
    return (
      <div className="JsonTree-Tree">
        <KeyValue name={this.props.title || ""} value={this._dataObject} />
      </div>)
  }
}

JsonTree.propTypes = {
  title: React.PropTypes.string,

  rules: React.PropTypes.arrayOf(React.PropTypes.func),

  data:  React.PropTypes.oneOfType([
    React.PropTypes.object, 
    React.PropTypes.string 
  ]).isRequired
}

JsonTree.displayName = 'JsonTree';


/*
*   key-value pairs
*/
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

KeyValue.displayName = "KeyValue";


/*
 *  Collapsable panel component
 */
class Collapsable extends Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: false};
  }

  toggle(e) {
    e.preventDefault();
  	this.setState({ collapsed: !this.state.collapsed });
  } 
  
  render() {
    return(
       <div className="JsonTree-Node-Item">
        <div className="JsonTree-Node-Key">
          <a href="#" onClick={this.toggle.bind(this)} className={"Collapsable-Arrow" + (this.state.collapsed ? "" : " Open")}>▼</a>
          <a href="#" onClick={this.toggle.bind(this)}>{this.props.title}</a>
        </div>
        <div className={ "Collapsable-Content JsonTree-Node-Value child-element" + (this.state.collapsed ? " hidden" : "") }>
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
EditorString.displayName = "EditorString";

class EditorLink extends EditorString {
  getLabel() {
  	return <span className="JsonTree-Node-Value-String">
		      "<a href={this.props.value} target="_blank">{this.props.value}</a>"
		   </span>
  } 
}
EditorLink.displayName = "EditorLink";

class EditorNumeric extends EditorString {
  getLabel(){
  	return <span className="JsonTree-Node-Value-Number">{this.props.value}</span>
  }
}
EditorNumeric.displayName = "EditorNumeric";


class EditorBoolean extends EditorString {
  getLabel() {
  	return <span className="JsonTree-Node-Value-Number">{JSON.stringify(this.props.value)}</span>
  }
}
EditorString.displayName = "EditorBoolean";

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
EditorDate.displayName = "EditorDate";

class EditorArray extends EditorString {
  render(){
  	return <Collapsable title={this.props.name}>
             {this.props.value.map((item, index)=>
               <KeyValue name={index} value={item} />
             )}
           </Collapsable>
  }
}
EditorArray.displayName = "EditorArray";

class EditorObject extends EditorString {
  render(){
  	return <Collapsable title={this.props.name}>
	          {Object.keys(this.props.value).map((item, index)=> 
	            <KeyValue name={item} value={this.props.value[item]} />
	          )}
	        </Collapsable>
  } 
}
EditorObject.displayName = "EditorObject";

class EditorFunc extends EditorString {

  getParamNames() {
    /*
      http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
    */
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;

    var fnStr = this.props.value.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null) result = [];
    return result;
  }

  render(){
    let sourceCode = this.props.value.toString().split('\n');

    return <Collapsable title={this.props.value.name + "(" + this.getParamNames() + ")"}>
             <div className="JsonTree-Node-Item JsonTree-Node-Value-Func">
                {sourceCode.map((line, index)=> {
                  return <div className="JsonTree-Node-Value-Func-Line" key={"line_"  +index}>
                            {line}
                         </div>
                })}
                
             </div>
          </Collapsable>
  } 
}
EditorFunc.displayName = "EditorFunc";


export default JsonTree;