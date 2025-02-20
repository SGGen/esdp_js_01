import React, {Fragment, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/PlusOne';
import {getAllFields, updateCleaningTypes} from "../../store/actions/newOrderActions";
import {connect} from "react-redux";

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(1),
  },
  formControl: {
    minWidth: "100%",
  },
  bottomIcon: {
    marginTop: theme.spacing(3),
  },
  select: {
    marginTop: theme.spacing(2)
  }
}));

const cleaningItems = {
  'sneakers': "Кроссовки",
  'boots': "Ботинки",
  'slingBacks': "Туфли",
  'highBoots': "Сапоги",
};

const cleaningPrices = {
  'sneakers': 1500,
  'boots': 2600,
  'slingBacks': 3000,
  'highBoots': 3800,
};

function UserForm(props) {

  const classes = useStyles();

  const [cleaningTypes, setCleaningTypes] = useState(props.defaultCleaningTypeFields);
  const handleCleaningTypesChange = event => {
    const _tempCleaningTypes = [...cleaningTypes];
    _tempCleaningTypes[event.target.dataset.id][event.target.name] = event.target.value;
    _tempCleaningTypes[event.target.dataset.id].price = cleaningPrices[_tempCleaningTypes[event.target.dataset.id].cleaningType];
    setCleaningTypes(_tempCleaningTypes);
  };


  const addNewCleaningType = () => {
    setCleaningTypes(prevCleaningTypes => [...prevCleaningTypes, { cleaningType: '', qty: 1, price: 0}]);
  };

  const removeCleaningType = (i) => {
    const _tempCleaningTypes = [...cleaningTypes];
    _tempCleaningTypes.splice(i, 1);
    setCleaningTypes(_tempCleaningTypes);
  };

  const getTotal = () => {
    props.getAllCleaningFields(cleaningTypes);
  };

  useEffect(() => {
    getTotal();
  });

  useEffect(() => {
    props.updateCleaningTypes(cleaningTypes);
  }, [cleaningTypes]);



  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Информация о заказе
      </Typography>
      <Grid container spacing={3}>
        <Fragment>
          {cleaningTypes.map((item, index) => (
            <Fragment key={index}>
              <Grid item xs={6} sm={7}>
                <TextField
                  select
                  className={classes.select}
                  data-id={index}
                  fullWidth
                  value={item.cleaningType}
                  onChange={handleCleaningTypesChange}
                  inputProps={{
                    name: 'cleaningType',
                    id: 'cleaningType',
                    'data-id': index
                  }}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Тип чистки"
                >
                  <option value="">
                    Не выбран
                  </option>
                  {Object.keys(cleaningItems).map((key, index) => (
                    <option key={index} value={key}>{cleaningItems[key]}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={classes.select}
                  data-id={index}
                  onChange={handleCleaningTypesChange}
                  type="number"
                  inputProps={{
                    min: "0", max: "10", step: "1",
                    'data-id': index
                  }}
                  value={item.qty}
                  required
                  id="qty"
                  name="qty"
                  helperText="Сколько пар?"
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                {index ?
                  <IconButton size="small" className={classes.bottomIcon} color="secondary" onClick={() => removeCleaningType(index)}>
                    <DeleteIcon fontSize="small"/>
                  </IconButton>
                : null}
              </Grid>
              <Grid item xs={1}>
                <IconButton size="small" className={classes.bottomIcon} color="primary"  onClick={addNewCleaningType}>
                  <AddIcon fontSize="small"/>
                </IconButton>
              </Grid>
            </Fragment>
          ))}
        </Fragment>
      </Grid>
    </Fragment>
  );
}
const mapStateToProps = state => {
  return {
    defaultCleaningTypeFields: state.newOrder.cleaningTypes,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCleaningFields: (arr) => dispatch(getAllFields(arr)),
    updateCleaningTypes: (order) => dispatch(updateCleaningTypes(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
