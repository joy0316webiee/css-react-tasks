import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { Form, Button, Input, Label, Select, Icon, Segment } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import 'semantic-ui-css/semantic.css';

import styles from './styles.module.scss';

const initialState = {
  name: '',
  size: 0,
  crops: [],
  noRows: 0,
  rowSpacing: 0,
  treeSpacing: 0,
  treesPerHa: 0,
  treesPerVines: 0,
  noTrees: 0,
  dateOfPlanting: '',
  age: 0,
  farmStatus: '',
  comments: '',
  errors: []
};

class FarmForm extends React.Component {
  state = { ...initialState };

  handleSelectionChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleInputChange = event => this.setState({ [event.target.name]: event.target.value });

  handleCropOptionSelect = option => {
    const { crops } = this.state;

    if (crops.includes(option)) {
      this.setState({ crops: crops.filter(crop => crop !== option) });
    } else {
      this.setState({ crops: crops.concat(option) });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const errors = this.validateForm();
    if (this.isEmpty(errors)) {
      const { rowSpacing, treeSpacing, size, dateOfPlanting } = this.state;
      const treesPerHa = (10000 / rowSpacing / treeSpacing).toFixed(3);
      const treesPerVines = (size * treesPerHa).toFixed(3);
      const age = moment(dateOfPlanting, 'DD / MM / YYYY')
        .fromNow()
        .split(' ')[0];

      this.setState({ treesPerHa, treesPerVines, age, errors }, () => {
        const { errors, ...payload } = this.state;
        console.log(payload);
      });
    } else {
      this.setState({ errors });
    }
  };

  validateForm = () => {
    let errors = [];

    Object.entries(this.state).forEach(([key, value]) => {
      if (this.isEmpty(this.state[key]) && key !== 'errors') {
        errors.push(`Field ${key} is required!`);
      }
    });
    ['size', 'noRows', 'rowSpacing', 'treeSpacing', 'noTrees'].forEach(key => {
      if (errors.some(error => error.includes(key))) return;
      if (!this.isPositiveFloat(this.state[key])) {
        errors.push(`Field ${key} should be positive float!`);
      }
    });

    return errors;
  };

  isEmpty = value => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    );
  };

  isPositiveFloat = value => !isNaN(value) && value > 0;

  renderErrorMessage = (errors, keyTerm) => {
    const errMessage = errors.find(err => err.includes(keyTerm));
    const errClasses = clsx('ui', 'pointing', 'above', 'prompt', 'label');

    return errMessage && <div className={errClasses}>{errMessage}</div>;
  };

  render() {
    // prettier-ignore
    const { name, size, crops, noRows, rowSpacing, treeSpacing, treesPerHa, treesPerVines, noTrees, dateOfPlanting, age, errors } = this.state;

    const cropOptions = ['Apples', 'Pears', 'Stone Fruits', 'Table Grape', 'Citrus'];
    const farmStatusOptions = [
      { key: 'pt', value: 'planting', text: 'Planting' },
      { key: 'gw', value: 'growing', text: 'Growing' }
    ];

    const classes = {
      fieldBlockSize: clsx(styles.formField, styles.blockSize),
      fieldCrops: clsx(styles.formField, styles.crops),
      cropOption: option => {
        return clsx(styles.cropOption, crops.includes(option) && styles.active);
      }
    };

    return (
      <div className={styles.farmFormWrapper}>
        <Segment className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            <Icon className={styles.iconBack} name="angle left" />
            Add Block
          </h2>
        </Segment>

        <Form className={styles.formContent}>
          <Form.Group className={styles.formGroup} widths="equal">
            <Form.Field className={styles.formField} width={10}>
              <label className={styles.asterisk}>Block name</label>
              <input
                name="name"
                className={styles.inputBlockName}
                type="text"
                value={name}
                onChange={this.handleInputChange}
              />
              {this.renderErrorMessage(errors, 'name')}
            </Form.Field>
            <Form.Field className={classes.fieldBlockSize} width={4}>
              <label className={styles.asterisk}>Block's size</label>
              <Input className={styles.formInput} labelPosition="right" type="text">
                <input
                  name="size"
                  type="text"
                  value={size}
                  style={{ width: 'inherit', flex: 1 }}
                  onChange={this.handleInputChange}
                />
                <Label>Ha</Label>
              </Input>
              {this.renderErrorMessage(errors, 'size')}
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Field className={classes.fieldCrops}>
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
              {this.renderErrorMessage(errors, 'crops')}
            </Form.Field>
          </Form.Group>

          <Label className={styles.labelForStructure}>Block's structure</Label>

          <Form.Group className={styles.formGroup} widths="equal">
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>No. Rows</label>
              <input
                name="noRows"
                type="text"
                value={noRows}
                onChange={this.handleInputChange}
              />
              {this.renderErrorMessage(errors, 'noRows')}
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>Row spacing</label>
              <Input
                className={styles.formInput}
                labelPosition="right"
                type="text"
                placeholder="in meter"
              >
                <input
                  name="rowSpacing"
                  type="text"
                  value={rowSpacing}
                  style={{ width: 'inherit' }}
                  onChange={this.handleInputChange}
                />
                <Label>m</Label>
              </Input>
              {this.renderErrorMessage(errors, 'rowSpacing')}
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label className={styles.asterisk}>Tree spacing</label>
              <Input
                className={styles.formInput}
                labelPosition="right"
                type="text"
                placeholder="in meter"
              >
                <input
                  name="treeSpacing"
                  type="text"
                  style={{ width: 'inherit' }}
                  value={treeSpacing}
                  onChange={this.handleInputChange}
                />
                <Label>m</Label>
              </Input>
              {this.renderErrorMessage(errors, 'treeSpacing')}
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup} widths="equal">
            <Form.Field className={styles.formField}>
              <label>Trees/Ha</label>
              <input type="text" value={treesPerHa} disabled />
            </Form.Field>
            <Form.Field className={styles.formField}>
              <label>Trees/Vines</label>
              <input type="text" value={treesPerVines} disabled />
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Field className={styles.formField} width={8}>
              <label className={styles.asterisk}>Actual No. of Trees</label>
              <input
                name="noTrees"
                className={styles.inputNoTrees}
                type="text"
                value={noTrees}
                placeholder="0"
                onChange={this.handleInputChange}
              />
              {this.renderErrorMessage(errors, 'noTrees')}
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Field className={styles.formField} width={8}>
              <label>Date of Planting</label>
              <DateInput
                name="dateOfPlanting"
                className={styles.datePicker}
                placeholder="DD / MM / YYYY"
                dateFormat="DD / MM / YYYY"
                value={dateOfPlanting}
                icon="calendar outline"
                iconPosition="right"
                popupPosition="top right"
                onChange={this.handleSelectionChange}
              />
              {this.renderErrorMessage(errors, 'dateOfPlanting')}
            </Form.Field>
            <Form.Field className={styles.formField} width={3}>
              <label>Age</label>
              <input type="text" value={age} disabled />
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Field className={styles.formField} width={8}>
              <label className={styles.asterisk}>Farm Status</label>
              <Select
                name="farmStatus"
                className={styles.farmStatusSelect}
                placeholder="Select Farm Status"
                options={farmStatusOptions}
                onChange={this.handleSelectionChange}
              />
              {this.renderErrorMessage(errors, 'farmStatus')}
            </Form.Field>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Field className={styles.formField} width={16}>
              <Form.TextArea
                name="comments"
                label="Comments & Notes"
                rows="4"
                onChange={this.handleInputChange}
              />
              {this.renderErrorMessage(errors, 'comments')}
            </Form.Field>
          </Form.Group>

          <Button
            className={styles.submitButton}
            type="submit"
            onClick={this.handleSubmit}
          >
            Add
          </Button>
        </Form>
      </div>
    );
  }
}

export default FarmForm;
