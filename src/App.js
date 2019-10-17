import React from 'react';
import clsx from 'clsx';
import { Form, Button, Input, Label, Select } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';

import 'semantic-ui-css/semantic.css';
import styles from './App.module.scss';

class App extends React.Component {
  state = {
    crops: ['Apples', 'Pears'],
    date: ''
  };

  handleDateChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleCropOptionSelect = option => {
    const { crops } = this.state;

    if (crops.includes(option)) {
      this.setState({ crops: crops.filter(crop => crop !== option) });
    } else {
      this.setState({ crops: crops.concat(option) });
    }
  };

  render() {
    const { date, crops } = this.state;

    const cropOptions = [
      'Apples',
      'Pears',
      'Stone Fruits',
      'Table Grape',
      'Citrus'
    ];
    const farmStatusOptions = [
      { key: 'pt', value: 'pt', text: 'Planting' },
      { key: 'gw', value: 'gw', text: 'Growing' }
    ];

    const classes = {
      crops: clsx(styles.formField, styles.crops),
      cropOption: option =>
        clsx(styles.cropOption, crops.includes(option) && styles.active)
    };

    return (
      <div className={styles.App}>
        <h2 className={styles.formTitle}>Add Block</h2>

        <Form className={styles.formContent}>
          <Form.Group className={styles.basic} widths="equal">
            <Form.Field className={styles.formField} width={10}>
              <label className={styles.asterisk}>Block name</label>
              <input type="text" />
            </Form.Field>
            <Form.Field className={styles.formField} width={4}>
              <label className={styles.asterisk}>Block's size</label>
              <Input labelPosition="right" type="text">
                <input />
                <Label>Ha</Label>
              </Input>
            </Form.Field>
          </Form.Group>

          <Form.Field className={classes.crops}>
            <label className={styles.asterisk}>Select your crop</label>
            <div className={styles.cropOptions}>
              {cropOptions.map((option, id) => (
                <div
                  key={id}
                  className={classes.cropOption(option)}
                  onClick={() => this.handleCropOptionSelect(option)}
                >
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </Form.Field>

          <Label className={styles.labelForStructure}>Block's structure</Label>

          <Form.Group className={styles.structure} widths="equal">
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>No. Rows</label>
              <input type="text" />
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>Row spacing</label>
              <Input labelPosition="right" type="text" placeholder="in meter">
                <input />
                <Label>m</Label>
              </Input>
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>Tree spacing</label>
              <Input labelPosition="right" type="text" placeholder="in meter">
                <input />
                <Label>m</Label>
              </Input>
            </Form.Field>
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Field className={styles.formField}>
              <label>Trees/Ha</label>
              <input className={styles.bgGrey} type="text" placeholder="0" />
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label>Trees/Vines</label>
              <input className={styles.bgGrey} type="text" placeholder="0" />
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>Actual No. of Trees</label>
              <input type="text" placeholder="0" />
            </Form.Field>
          </Form.Group>

          <Form.Group>
            <Form.Field className={styles.formField} width={8}>
              <label>Date of Planting</label>
              <DateInput
                name="date"
                placeholder="DD / MM / YYYY"
                dateFormat="DD / MM / YYYY"
                value={date}
                iconPosition="right"
                popupPosition="top right"
                onChange={this.handleDateChange}
              />
            </Form.Field>
            <Form.Field className={styles.formField} width={3}>
              <label>Age</label>
              <input className={styles.bgGrey} type="text" placeholder="0" />
            </Form.Field>
          </Form.Group>

          <Form.Field className={styles.formField} width={8}>
            <label className={styles.asterisk}>Farm Status</label>
            <Select
              className={styles.farmStatusSelect}
              placeholder="Select Farm Status"
              options={farmStatusOptions}
            />
          </Form.Field>

          <Form.TextArea
            className={styles.formField}
            label="Comments & Notes"
            rows="4"
          />

          <Button className={styles.submitButton} type="submit">
            Add
          </Button>
        </Form>
      </div>
    );
  }
}

export default App;
