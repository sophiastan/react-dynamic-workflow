import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class Deadline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            hasDeadlineChecked: false,
            date: new Date().toISOString().substr(0, 10),
            todayDate: "",
            defaultValue: ""
        };
    }

    getDateFormat = (date) => {
        /***
         * This function will formate the date for input
         * @param {Date} date The date object we wish to formate
         */

        // Create the day, month, and year variables
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var y = date.getFullYear();

        // Month under 10 add leading 0
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        // Format
        const dateFormat = y + '-' + mm + '-' + dd;

        return dateFormat;
    }

    // setDateValues = (target_input) => {
    //     // Create Date objects
    //     var today = new Date();
    //     var max_days = new Date();
    //     var predefine_date = new Date();

    //     // Set max days and get string outputs
    //     this.state.today_date = this.getDateFormat(today);
    //     today.setDate(today.getDate() + 1);
    //     max_days.setDate(today.getDate() + this.max_days);
    //     var max_days_date = this.getDateFormat(max_days);

    //     // Set range of dates
    //     if(typeof this.state.default_value !== 'undefined'){
    //         predefine_date.setDate(today.getDate() + Number(this.state.default_value));
    //         let predefine_date_format = this.getDateFormat(predefine_date)
    //         target_input.value = predefine_date_format;
    //     }
    //     else{
    //         target_input.value = this.state.today_date;
    //     }

    //     target_input.min = this.state.today_date;
    //     target_input.max = max_days_date;
    // }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }


    // Event handler when deadline changed
    onDeadlineChanged = (event) => {
        const dateInput = event.target.value;

        const todayDate = new Date();
        const selectedDate = new Date(dateInput);

        const diffTime = Math.abs(selectedDate - todayDate);
        const daysUntilSigningDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("daysUntilSigningDeadline: " + daysUntilSigningDeadline);

        this.state.setParentState({ deadline: daysUntilSigningDeadline });
        console.log("deadline: " + this.state.getParentState().deadline);
    }

    render() {
        return (
            <div className="add_border_bottom" id="deadline_div">
                <input type="checkbox" name="hasDeadlineChecked" id="deadline_checkbox" onClick={this.onCheckboxChanged}></input>
                <label className="checkbox_input" htmlFor="deadline_checkbox">Completion Deadline</label>
                {
                    this.state.hasDeadlineChecked &&
                    <div id="sub_deadline_div" className="add_border_bottom">
                        <input type="date" name="deadline" id="deadline_input" value={this.state.date}
                            className="recipient_form_input" onChange={this.onDeadlineChanged}></input>
                    </div>
                }
            </div>
        );
    }
}

export default Deadline;