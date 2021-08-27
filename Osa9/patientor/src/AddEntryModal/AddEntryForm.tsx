import React, {useState} from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, TypeOption, NumberField } from "./FormField";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Type } from "../types";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { useStateValue } from "../state/state";

export type EntryFormValues = Omit<Entry, "id" >;
export type HealthCheckEntryFormValues = Omit<HealthCheckEntry, "id" >;
export type HospitalEntryFormValues = Omit<HospitalEntry, "id" >;
export type OccupationalEntryFormValues = Omit<OccupationalHealthcareEntry, "id" >;

interface Props {
  onHealthCheckSubmit: (values: HealthCheckEntryFormValues) => void;
  onHospitalEntrySubmit: (values: HospitalEntryFormValues) => void;
  onOccupationalEntrySubmit: (values: OccupationalEntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: Type.Hospital, label: "Hospital" },
  { value: Type.HealthCheck, label: "HealthCheck" },
  { value: Type.OccupationalHealth, label: "OccupationalHealthcare" }
];

export const AddEntryForm = ({ onHospitalEntrySubmit, onHealthCheckSubmit, onOccupationalEntrySubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();
  const [ type, setType ] = useState('Hospital');
  if (type === 'Hospital') {
  return (
    <Formik
      initialValues={{
        date: "",
        description: "",
        specialist: "",
        type: "Hospital",
        discharge: {
          date: "",
          criteria: ""
        }
      }}
      onSubmit={onHospitalEntrySubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        const dischargeErrors: { discharge: { [field: string]: string  }} = { discharge: {} };
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.discharge.date) {
          dischargeErrors.discharge.date = requiredError;
        }
        if (!values.discharge.criteria) {
          dischargeErrors.discharge.criteria = requiredError;
        }
        setType(values.type);
        if (dischargeErrors.discharge.date || dischargeErrors.discharge.criteria) {
          return { ...errors, ...dischargeErrors};
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        console.log(isValid, dirty);
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge['date']"
              component={TextField}
            />
            <Field
              label="Discharge criteria"
              placeholder="Discharge criteria"
              name="discharge['criteria']"
              component={TextField}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
  } else if (type === 'HealthCheck') {
    return (
      <Formik
        initialValues={{
          date: "",
          description: "",
          specialist: "",
          type: "HealthCheck",
          healthCheckRating: 0
        }}
        onSubmit={onHealthCheckSubmit}
        validate={values => {
          const requiredError = "Field is required";
          const ratingError = "Rating must be between 0-3";
          const errors: { [field: string]: string } = {};
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.type) {
            errors.type = requiredError;
          }
          if (values.healthCheckRating < 0 ||values.healthCheckRating > 3) {
            errors.healthCheckRating = ratingError;
          }
          if (!values.healthCheckRating && values.healthCheckRating !== 0) {
            errors.healthCheckRating = requiredError;
          }
          setType(values.type);
          console.log(errors);
          return errors;
        }}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
          console.log(isValid, dirty);
          return (
            <Form className="form ui">
              <SelectField
                label="Type"
                name="type"
                options={typeOptions}
              />
              <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
              />
              <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
              />
              <Field
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    );
  } else {
    return (
      <Formik
        initialValues={{
          date: "",
          description: "",
          specialist: "",
          type: "OccupationalHealthcare",
          employerName: ""
        }}
        onSubmit={onOccupationalEntrySubmit}
        validate={values => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.type) {
            errors.type = requiredError;
          }
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          setType(values.type);
          //console.log(type);
          return errors;
        }}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
          console.log(isValid, dirty);
          return (
            <Form className="form ui">
              <SelectField
                label="Type"
                name="type"
                options={typeOptions}
              />
              <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
              />
              <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
              />
              <Field
              label="Employer"
              placeholder="Employer"
              name="employerName"
              component={TextField}
              />
              <Field
                label="Sickleave starting date"
                placeholder="YYYY-MM-DD"
                name="sickLeave['startDate']"
                component={TextField}
              />
              <Field
                label="Sickleave ending date"
                placeholder="YYYY-MM-DD"
                name="sickLeave['endDate']"
                component={TextField}
              />
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    );
    }
};

export default AddEntryForm;
