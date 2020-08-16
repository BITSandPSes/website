import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import './elecHomed.css';

class CheckBox extends Component {
    render() {
        return(
            <FormGroup key = {this.props.id} check className = "checkers col-12 mb-sm-2 ">
                <Label check className = "filter-label-font">
                    <Input type = "checkbox" 
                     name = "filter-box"
                     checked = {this.props.isChecked} 
                     value = {this.props.value}
                     onClick = {this.props.handleCheckChild} />{this.props.name}
                </Label>
            </FormGroup>
        );
    }
}

export default CheckBox;