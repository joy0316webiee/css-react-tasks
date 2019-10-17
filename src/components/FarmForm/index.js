import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {
  Form,
  Button,
  Input,
  Label,
  Select,
  Icon,
  Segment
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import { DateInput } from 'semantic-ui-calendar-react';
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

  handleInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

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
    this.setState({ errors });

    if (errors.length === 0) {
      const { rowSpacing, treeSpacing, size, dateOfPlanting } = this.state;
      const treesPerHa = (10000 / rowSpacing / treeSpacing).toFixed(3);
      const treesPerVines = (size * treesPerHa).toFixed(3);
      const age = moment(dateOfPlanting, 'DD / MM / YYYY')
        .fromNow()
        .split(' ')[0];

      this.setState({
        treesPerHa,
        treesPerVines,
        age
      });

      const payload = { ...this.state };
      console.log(payload);
    }
  };

  validateForm = () => {
    const {
      name,
      size,
      crops,
      noRows,
      rowSpacing,
      treeSpacing,
      noTrees,
      dateOfPlanting,
      farmStatus,
      comments
    } = this.state;

    let errors = [];
    if (this.isEmpty(name)) errors.push('Block name is required!');
    if (this.isEmpty(size)) {
      errors.push("Block's size is required!");
    } else if (!this.isPositiveFloat(size)) {
      errors.push("Block's size should be positive float!");
    }
    if (this.isEmpty(crops)) errors.push('Crops are required!');
    if (this.isEmpty(noRows)) {
      errors.push('No. Rows is required!');
    } else if (!this.isPositiveFloat(noRows)) {
      errors.push('No. Rows should be positive float!');
    }
    if (this.isEmpty(rowSpacing)) {
      errors.push('Row spacing is required!');
    } else if (!this.isPositiveFloat(rowSpacing)) {
      errors.push('Row spacing should be positive float!');
    }
    if (this.isEmpty(treeSpacing)) {
      errors.push('Tree spacing is required!');
    } else if (!this.isPositiveFloat(treeSpacing)) {
      errors.push('Tree spacing should be positive float!');
    }
    if (this.isEmpty(noTrees)) {
      errors.push('No. of Trees is required!');
    } else if (!this.isPositiveFloat(noTrees)) {
      errors.push('No. of Trees should be positive float!');
    }
    if (this.isEmpty(dateOfPlanting)) errors.push('Date is required!');
    if (this.isEmpty(farmStatus)) errors.push('Farm Status is required!');
    if (this.isEmpty(comments)) errors.push('Comments is required!');

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
    const {
      name,
      size,
      crops,
      noRows,
      rowSpacing,
      treeSpacing,
      treesPerHa,
      treesPerVines,
      noTrees,
      dateOfPlanting,
      age,
      errors
    } = this.state;

    const cropOptions = [
      'Apples',
      'Pears',
      'Stone Fruits',
      'Table Grape',
      'Citrus'
    ];
    const farmStatusOptions = [
      { key: 'pt', value: 'planting', text: 'Planting' },
      { key: 'gw', value: 'growing', text: 'Growing' }
    ];

    const classes = {
      fieldBlockSize: clsx(styles.formField, styles.blockSize),
      fieldCrops: clsx(styles.formField, styles.crops),
      cropOption: option =>
        clsx(styles.cropOption, crops.includes(option) && styles.active)
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
              {this.renderErrorMessage(errors, 'Block name')}
            </Form.Field>
            <Form.Field className={classes.fieldBlockSize} width={4}>
              <label className={styles.asterisk}>Block's size</label>
              <Input
                className={styles.formInput}
                labelPosition="right"
                type="text"
              >
                <input
                  name="size"
                  type="text"
                  value={size}
                  style={{ width: 'inherit', flex: 1 }}
                  onChange={this.handleInputChange}
                />
                <Label>Ha</Label>
              </Input>
              {this.renderErrorMessage(errors, "Block's size")}
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
              {this.renderErrorMessage(errors, 'Crops')}
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
              {this.renderErrorMessage(errors, 'No. Rows')}
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
              {this.renderErrorMessage(errors, 'Row spacing')}
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
              {this.renderErrorMessage(errors, 'Tree spacing')}
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
              {this.renderErrorMessage(errors, 'No. of Trees')}
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
                popupPosition="bottom right"
                onChange={this.handleSelectionChange}
              />
              {this.renderErrorMessage(errors, 'Date')}
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
              {this.renderErrorMessage(errors, 'Farm Status')}
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
              {this.renderErrorMessage(errors, 'Comments')}
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
