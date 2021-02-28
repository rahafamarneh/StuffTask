import React from "react";
import ReactDOM from "react-dom";
import './App.css';

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: false, hover: false };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState(
      (prevState) => ({ selected: !prevState.selected }),
      () => this.props.onOptionChange(this.props.option, this.state.selected)
    );
  }
  onMouseLeave = () => {
    this.setState({ hover: false });
  };
  onMouseEnter = () => {
    this.setState({ hover: true });
  };
  render() {
    let btnClass = [
      this.props.selected ? "checked" : "notChecked",
      this.state.hover ? "hovered" : "notHovered"
    ];
    btnClass = btnClass.join(" ");
    return (
      <li
        className={btnClass}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className="optionName">
          <label htmlFor={this.props.option}>{this.props.option}</label>
        </div>
        <input
          type="checkbox"
          id={this.props.option}
          name="option name"
          value={this.props.option}
          onChange={this.handleChange}
          checked={this.props.selected}
          className={this.props.selected ? "checked" : "notChecked"}
          onMouseOver={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      </li>
    );
  }
}
class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      list: props.options,
      filteredList: [],
      searchString: ""
    };
    this.filterList = this.filterList.bind(this);
    this.onOptionsChange = this.onOptionsChange.bind(this);
  }
  componentWillMount() {
    this.setState({ filteredList: this.state.list  });
  }
  filterList(value) {
    let searchValue = value.toLowerCase();
    let filteredList = this.state.list;
    filteredList = filteredList.filter((item) => {
      return item.option.toLowerCase().search(searchValue) !== -1;
    });
    this.setState({ filteredList: filteredList });
    this.setState({ searchString: value });
  }
  changeList(list, option, selected) {
    list.map((item) => {
      if (item.option === option) {
        item.selected = selected;
      }
      return item;
    });
    return list;
  }
  onOptionsChange(option, selected) {
    if (selected) {
      this.setState(
        (prevState) => {
          prevState.selectedOptions.push(option);
          return {
            selectedOptions: prevState.selectedOptions,
            list: this.changeList(prevState.list, option, selected)
          };
        },
        () => this.props.onOptionsChange(this.state.selectedOptions)
      );
    } else {
      this.setState(
        (prevState) => {
          const index = prevState.selectedOptions.indexOf(option);
          if (index > -1) {
            prevState.selectedOptions.splice(index, 1);
          }
          return {
            selectedOptions: prevState.selectedOptions,
            list: this.changeList(prevState.list, option, selected)
          };
        },
        () => this.props.onOptionsChange(this.state.selectedOptions)
      );
    }
  }
  render() {
    return (
      <div class="container">
        <SearchInput value={this.state.searchString} update={this.filterList} />
        <ul class="optionsContainer">
          {this.state.filteredList.map((option, index) => (
            <Option
              {...option}
              onOptionChange={this.onOptionsChange}
              filter={this.filterList}
              key={index}
            />
          ))}
        </ul>
        <p classsName="selectedOptions">
          Selected Options: {this.state.selectedOptions + ""}
        </p>
      </div>
    );
  }
}
class OptionsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { option: "Budget", selected: false },
        { option: "Food allergies", selected: false },
        { option: "Number of people", selected: false },
        { option: "Special restrictions", selected: false }
      ],
    };
    this.onOptionsChange = this.onOptionsChange.bind(this);
  }
  onOptionsChange(selectedOptions) {
    this.setState({ selectedOptions: selectedOptions });
  }
  
  render() {
    return (
      <>
        <Options
          options={this.state.options}
          onOptionsChange={this.onOptionsChange}
        />
      </>
    );
  }
}

class SearchInput extends React.Component {
  constructor() {
    super();
    this.onValueChange = this.onValueChange.bind(this);
  }
  onValueChange(event) {
    this.props.update(event.target.value);
  }
  render() {
    return (
      <div className="search-input">
        <input
          ref="input"
          onChange={this.onValueChange}
          value={this.props.value}
          type="text"
          placeholder="Search questions"
        />
      </div>
    );
  }
}
ReactDOM.render(<OptionsContainer />, document.getElementById("root"));