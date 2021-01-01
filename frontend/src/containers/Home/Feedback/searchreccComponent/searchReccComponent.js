import React, { Component } from 'react';
import { Button } from 'reactstrap';
import "./searchRecc.css"

class SearchRecc extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if(this.props.show) {
            let styler = "search-content";
            if(this.props.list.length != 0) {
                styler = styler + " search-recc-padding"
            } 
            return(
                <div className = "search-wrap" >
                    <div className = {styler}>
                        { this.props.list.map((course) => {
                            let name = this.props.display == 1 ? course.courseName: course.courseNo;
                            return(
                                <h6 
                                onClick = {() => { this.props.click(course); }}
                                className = "search-recc-row text-lg-left">{name}</h6>
                            );
                        })}
                    </div>
                </div>
            );
        }
        else {
            return(
                <div/>
            );
        }
    }
}

export default SearchRecc;