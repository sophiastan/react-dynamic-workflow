import React, { Component } from 'react';

// Component for managing a list of carbon copy groups
class Reminder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            onCheckboxChanged: props.onCheckboxChanged,
            hasReminderChecked: false
        };
    }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }


    // Sets reminders
    onReminderChanged = (event) => {
        this.state.setParentState({ reminders: event.target.value });
        console.log(this.state.getParentState().reminders);
    }

    render() {
        return (
            <div className="add_border_bottom" id="reminder_div" onClick={this.onCheckboxChanged}>
                <input type="checkbox" name="hasReminderChecked" id="reminder_checkbox"></input>
                <label className="checkbox_input" htmlFor="reminder_checkbox">Set Reminder</label>
                {
                    this.state.hasReminderChecked &&
                    <div id="sub_reminder_div" className="add_border_bottom">
                        <select id="reminder_dropdown" onChange={this.onReminderChanged}>
                            <option value="DAILY_UNTIL_SIGNED">Every day</option>
                            <option value="WEEKLY_UNTIL_SIGNED">Every week</option>
                            <option value="WEEKDAILY_UNTIL_SIGNED">Every business day</option>
                            <option value="EVERY_OTHER_DAY_UNTIL_SIGNED">Every other day</option>
                            <option value="EVERY_THIRD_DAY_UNTIL_SIGNED">Every third day</option>
                            <option value="EVERY_FIFTH_DAY_UNTIL_SIGNED">Every fifth day</option>
                        </select>
                    </div>
                }
            </div>
        );
    }
}

export default Reminder;