import React, { Component } from 'react';
import { Button } from 'reactstrap';

class SearchRecc extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if(this.props.show) {
            return(
                <div className = "searchReccBox" >
                    <div className = "search-absolute-box">
                        { this.props.list.map((course) => {
                            let name = this.props.display == 1 ? course.courseName: course.courseNo;
                            return(
                                <Button 
                                className = "search-recc-button"
                                onClick = {() => { this.props.click(course); }}>{name}</Button>
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